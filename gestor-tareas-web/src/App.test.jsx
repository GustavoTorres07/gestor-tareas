import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';
import App from './App';

test('Debe renderizar el título del gestor de tareas', () => {
  render(<App />);
  const titleElement = screen.getByText(/Gestor de Tareas/i);
  expect(titleElement).toBeInTheDocument();
});