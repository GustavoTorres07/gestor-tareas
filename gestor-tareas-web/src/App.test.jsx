import { render, screen, fireEvent } from '@testing-library/react';
import { expect, test } from 'vitest';
import App from './App';

// 1. Smoke Test de la Pantalla de Login
test('Debe renderizar la pantalla de Portal de Acceso (Login)', () => {
  render(<App />);
  const titleElement = screen.getByText(/Gestión Institucional/i);
  expect(titleElement).toBeInTheDocument();
});

// 2. Validación de UI: Formulario de Login
test('Debe renderizar el input de correo y permitir escribir en él', () => {
  render(<App />);
  
  // Buscamos el input por su tipo, ya que es el único type="email" en pantalla
  const emailInput = screen.getByRole('textbox', { type: 'email' });
  expect(emailInput).toBeInTheDocument();

  // Simulamos que el usuario escribe un correo
  fireEvent.change(emailInput, { target: { value: 'admin@gob.ar' } });
  
  // Verificamos que el estado se actualizó
  expect(emailInput.value).toBe('admin@gob.ar');
});

// 3. Renderizado del Botón de Acceso
test('Debe mostrar el botón para ingresar al sistema', () => {
  render(<App />);
  
  // Buscamos el botón por su rol y texto
  const loginButton = screen.getByRole('button', { name: /Ingresar al Sistema/i });
  expect(loginButton).toBeInTheDocument();
});