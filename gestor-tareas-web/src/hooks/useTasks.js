import { useState, useCallback } from 'react';
import axios from 'axios';

const API_BASE = 'https://localhost:44390/api';

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [taskStates, setTaskStates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // FETCH: Obtiene todos los datos iniciales
  const fetchAllData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [tasksRes, usersRes, statesRes] = await Promise.all([
        axios.get(`${API_BASE}/Tasks`),
        axios.get(`${API_BASE}/Users`),
        axios.get(`${API_BASE}/TaskStates`)
      ]);
      setTasks(tasksRes.data);
      setUsers(usersRes.data);
      setTaskStates(statesRes.data);
    } catch (err) {
      setError('Error crítico: No se pudo establecer conexión con el servidor central.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // CREATE / UPDATE genérico
  const saveItem = async (endpoint, item, id = null) => {
    try {
      if (id) {
        await axios.put(`${API_BASE}/${endpoint}/${id}`, item);
      } else {
        await axios.post(`${API_BASE}/${endpoint}`, item);
      }
      await fetchAllData(); // Recarga los datos automáticamente
    } catch (err) {
      throw new Error("Error al guardar el registro en la base de datos.");
    }
  };

  // DELETE genérico
  const deleteItem = async (endpoint, id) => {
    try {
      await axios.delete(`${API_BASE}/${endpoint}/${id}`);
      await fetchAllData();
    } catch (err) {
      throw new Error("No se pudo eliminar. Verifique que el registro no esté en uso.");
    }
  };

  return { tasks, users, taskStates, loading, error, fetchAllData, saveItem, deleteItem };
};