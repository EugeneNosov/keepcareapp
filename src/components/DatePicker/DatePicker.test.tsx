// @vitest-environment jsdom

import '@/test/setup-dom.ts';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';
import DatePicker from './DatePicker.tsx';

function formatLocalDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

describe('DatePicker', () => {
  test('reports today as the selected date and finishes the interaction', async () => {
    const user = userEvent.setup();
    const onBlur = vi.fn();
    const onChange = vi.fn();
    render(
      <DatePicker
        id="starts-at"
        label="Starts at"
        name="startsAt"
        onBlur={onBlur}
        onChange={onChange}
        value=""
      />,
    );
    const trigger = screen.getByRole('button', {name: 'Starts at'});

    await user.click(trigger);
    await user.click(screen.getByRole('button', {name: /^Today$/}));

    expect(onChange).toHaveBeenCalledWith(formatLocalDate(new Date()));
    expect(onBlur).toHaveBeenCalledOnce();
    expect(screen.queryByRole('dialog', {name: 'Choose start date'}))
      .not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });
});
