// @vitest-environment jsdom

import '@/test/setup-dom.ts';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test } from 'vitest';
import Checkbox from './Checkbox.tsx';

describe('Checkbox', () => {
  test('communicates its checked state through the native checkbox', async () => {
    const user = userEvent.setup();
    render(<Checkbox label="Include deleted tasks"/>);
    const checkbox = screen.getByRole('checkbox', {
      name: 'Include deleted tasks',
    });

    expect(checkbox).not.toBeChecked();

    await user.click(checkbox);

    expect(checkbox).toBeChecked();
  });
});
