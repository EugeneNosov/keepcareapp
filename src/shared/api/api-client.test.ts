import {
  afterEach,
  describe,
  expect,
  test,
  vi,
} from 'vitest';
import {
  apiRequest,
  setApiAccessToken,
  setApiRefreshHandler,
  setApiUnauthorizedHandler,
} from './api-client.ts';
import { ApiError } from './api-error.ts';

function jsonResponse(status: number, payload: unknown) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {'Content-Type': 'application/json'},
  });
}

describe('apiRequest error handling', () => {
  afterEach(() => {
    setApiAccessToken(null);
    setApiRefreshHandler(null);
    setApiUnauthorizedHandler(null);
    vi.unstubAllGlobals();
  });

  test('converts an HTTP validation response to ApiError', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse(422, {
      message: ['Task name is required.', 'Start date is invalid.'],
      error: 'Unprocessable Entity',
    })));

    const request = apiRequest('/tasks', {
      method: 'POST',
      body: {name: ''},
    });

    await expect(request).rejects.toMatchObject({
      name: 'ApiError',
      status: 422,
      message: 'Task name is required.',
      details: ['Task name is required.', 'Start date is invalid.'],
    });
  });

  test('uses a safe message for a non-JSON HTTP failure', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(
      'Internal infrastructure details',
      {
        status: 502,
        headers: {'Content-Type': 'text/plain'},
      },
    )));

    await expect(apiRequest('/tasks')).rejects.toEqual(
      new ApiError(502, 'Something went wrong. Please try again.'),
    );
  });

  test('refreshes authentication once and retries with the new token', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(jsonResponse(401, {message: 'Unauthorized.'}))
      .mockResolvedValueOnce(jsonResponse(200, {id: 'task-1'}));
    const refreshHandler = vi.fn().mockResolvedValue('new-access-token');
    const unauthorizedHandler = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    setApiAccessToken('expired-access-token');
    setApiRefreshHandler(refreshHandler);
    setApiUnauthorizedHandler(unauthorizedHandler);

    await expect(apiRequest<{id: string}>('/tasks/task-1')).resolves.toEqual({
      id: 'task-1',
    });

    expect(refreshHandler).toHaveBeenCalledOnce();
    expect(unauthorizedHandler).not.toHaveBeenCalled();
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect((fetchMock.mock.calls[0][1].headers as Headers).get('Authorization'))
      .toBe('Bearer expired-access-token');
    expect((fetchMock.mock.calls[1][1].headers as Headers).get('Authorization'))
      .toBe('Bearer new-access-token');
  });

  test('notifies authentication state when the refreshed request is unauthorized', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(jsonResponse(401, {message: 'Expired token.'}))
      .mockResolvedValueOnce(jsonResponse(401, {message: 'Session expired.'}));
    const refreshHandler = vi.fn().mockResolvedValue('replacement-token');
    const unauthorizedHandler = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    setApiAccessToken('expired-access-token');
    setApiRefreshHandler(refreshHandler);
    setApiUnauthorizedHandler(unauthorizedHandler);

    await expect(apiRequest('/tasks')).rejects.toMatchObject({
      status: 401,
      message: 'Session expired.',
    });

    expect(refreshHandler).toHaveBeenCalledOnce();
    expect(unauthorizedHandler).toHaveBeenCalledOnce();
  });

  test('does not attempt recursive refresh for a refresh request', async () => {
    const refreshHandler = vi.fn().mockResolvedValue('unused-token');
    const unauthorizedHandler = vi.fn();
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(
      jsonResponse(401, {message: 'Refresh session expired.'}),
    ));
    setApiAccessToken('expired-access-token');
    setApiRefreshHandler(refreshHandler);
    setApiUnauthorizedHandler(unauthorizedHandler);

    await expect(apiRequest('/auth/refresh', {
      method: 'POST',
      skipAuthRefresh: true,
    })).rejects.toMatchObject({
      status: 401,
      message: 'Refresh session expired.',
    });

    expect(refreshHandler).not.toHaveBeenCalled();
    expect(unauthorizedHandler).not.toHaveBeenCalled();
  });

  test('passes network failures through for the shared message policy', async () => {
    const networkError = new TypeError('Failed to fetch');
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(networkError));

    await expect(apiRequest('/tasks')).rejects.toBe(networkError);
  });
});
