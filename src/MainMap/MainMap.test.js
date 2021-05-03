import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import MainMap from './MainMap';

describe('<MainMap />', () => {
  test('it should mount', () => {
    render(<MainMap />);
    const mainMap = screen.getByTestId('MainMap');
    expect(mainMap).toBeInTheDocument();
  });
});
