import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';

test('renders the headline', () => {
  render(<App />);
  const headline = screen.getByText(/SILVESTER S KARLEM SEDLÁČKEM/i);
  expect(headline).toBeInTheDocument();
});

test('renders the discord link', () => {
  render(<App />);
  const link = screen.getByLabelText(/discord/i);
  const icon = screen.getByAltText(/discord/i);

  expect(link).toHaveAttribute('href', expect.stringContaining('discord.gg'));
  expect(icon).toHaveAttribute('src', expect.stringContaining('discord.svg'));
});

test('renders the info page with map and chata link', () => {
  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: /info/i }));

  expect(screen.getByText(/chata klauzovka/i)).toBeInTheDocument();
  expect(screen.getByTitle(/mapa/i)).toBeInTheDocument();
});
