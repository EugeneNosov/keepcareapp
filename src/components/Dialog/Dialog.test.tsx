// @vitest-environment jsdom

import '@/test/setup-dom.ts';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import Dialog from './Dialog.tsx';

describe('Dialog', () => {
  beforeEach(() => {
    document.querySelectorAll('#dialog-root').forEach((root) => root.remove());

    const dialogRoot = document.createElement('div');
    dialogRoot.id = 'dialog-root';
    document.body.append(dialogRoot);

    Object.defineProperty(HTMLDialogElement.prototype, 'showModal', {
      configurable: true,
      value() {
        this.setAttribute('open', '');
      },
    });
    Object.defineProperty(HTMLDialogElement.prototype, 'close', {
      configurable: true,
      value() {
        this.removeAttribute('open');
        this.dispatchEvent(new Event('close'));
      },
    });
  });

  afterEach(() => {
    document.querySelectorAll('#dialog-root').forEach((root) => root.remove());
  });

  test('requests closure from its close button', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(
      <Dialog isOpen onClose={onClose} title="Edit task">
        <p>Dialog content</p>
      </Dialog>,
    );

    await user.click(screen.getByRole('button', {name: 'Close dialog'}));

    expect(onClose).toHaveBeenCalledOnce();
  });

  test('reports a native dialog close event', () => {
    const onClose = vi.fn();
    render(
      <Dialog isOpen onClose={onClose} title="Edit task">
        <p>Dialog content</p>
      </Dialog>,
    );

    fireEvent(screen.getByRole('dialog'), new Event('close'));

    expect(onClose).toHaveBeenCalledOnce();
  });
});
