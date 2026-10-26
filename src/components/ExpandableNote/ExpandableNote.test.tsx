// @vitest-environment jsdom

import '@/test/setup-dom.ts';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import ExpandableNote from './ExpandableNote.tsx';

describe('ExpandableNote', () => {
  beforeEach(() => {
    vi.stubGlobal('ResizeObserver', class ResizeObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    });
    vi.spyOn(HTMLElement.prototype, 'scrollHeight', 'get').mockReturnValue(48);
    vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockReturnValue(32);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  test('expands and collapses an overflowing note', async () => {
    const user = userEvent.setup();
    render(<ExpandableNote note="A note long enough to overflow two lines."/>);
    const toggle = screen.getByRole('button', {name: 'Show more'});

    expect(toggle).toHaveAttribute('aria-expanded', 'false');

    await user.click(toggle);

    expect(screen.getByRole('button', {name: 'Show less'}))
      .toHaveAttribute('aria-expanded', 'true');

    await user.click(screen.getByRole('button', {name: 'Show less'}));

    expect(screen.getByRole('button', {name: 'Show more'}))
      .toHaveAttribute('aria-expanded', 'false');
  });
});
