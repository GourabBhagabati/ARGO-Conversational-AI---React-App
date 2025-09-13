import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders ARGO Conversational AI', () => {
  render(<App />);
  const linkElement = screen.getByText(/ARGO Conversational AI/i);
  expect(linkElement).toBeInTheDocument();
});
