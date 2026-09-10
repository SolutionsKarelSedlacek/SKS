import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';

beforeEach(() => {
  window.history.pushState({}, '', '/');
});

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

test('keeps the hero background visible when the info page is open', () => {
  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: /info/i }));

  expect(document.querySelector('.hero-img')).toBeInTheDocument();
  expect(document.querySelector('.hero')).toBeInTheDocument();
});

test('loads the form page from a tokenized URL and prints the token', () => {
  const logSpy = jest.spyOn(console, 'log').mockImplementation(() => undefined);
  window.history.pushState({}, '', '/form/abcd1234');

  render(<App />);

  expect(screen.getByTestId('form-page')).toBeInTheDocument();
  expect(logSpy).toHaveBeenCalledWith('form token', 'abcd1234');

  logSpy.mockRestore();
});

test('opens the Karlopolis people page from the main screen', () => {
  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: /karlopolis/i }));

  expect(screen.getByText(/Byl jednou jeden karel/i)).toBeInTheDocument();
});

test('navigates to the local stars page from the info screen', () => {
  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: /info/i }));
  fireEvent.click(screen.getByRole('button', { name: /naše hvězdy/i }));

  expect(screen.getByText(/naše hvězdy/i)).toBeInTheDocument();
});

test('keeps the program widget before the map info in the default desktop layout', () => {
  const { container } = render(<App />);

  fireEvent.click(screen.getByRole('button', { name: /info/i }));

  const infoPage = container.querySelector('.info-page');
  const infoStack = infoPage?.querySelector('.info-stack');
  const programWidget = infoPage?.querySelector('.program-widget');

  expect(infoPage).not.toBeNull();
  expect(infoStack).not.toBeNull();
  expect(programWidget).not.toBeNull();
  expect(
    programWidget && infoStack && (
      programWidget.compareDocumentPosition(infoStack) & Node.DOCUMENT_POSITION_FOLLOWING
    )
  ).toBeTruthy();
});
