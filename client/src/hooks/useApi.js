import { useState, useEffect } from 'react';

const API_BASE = 'http://localhost:3000/api';

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('focusflow-token');
};

// Generic API hook
export function useApi(endpoint, initialValue = []) {
  const [data, setData] = useState(initialValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = getAuthToken();

  const fetchData = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setData(result);
      setError(null);
    } catch (err) {
      console.error(`Error fetching ${endpoint}:`, err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createItem = async (item) => {
    if (!token) return null;

    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(item),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const newItem = await response.json();
      setData(prev => [newItem, ...prev]);
      return newItem;
    } catch (err) {
      console.error(`Error creating item:`, err);
      setError(err.message);
      return null;
    }
  };

  const updateItem = async (id, updates) => {
    if (!token) return null;

    try {
      const response = await fetch(`${API_BASE}${endpoint}/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedItem = await response.json();
      setData(prev => prev.map(item => item.id === id ? updatedItem : item));
      return updatedItem;
    } catch (err) {
      console.error(`Error updating item:`, err);
      setError(err.message);
      return null;
    }
  };

  const deleteItem = async (id) => {
    if (!token) return false;

    try {
      const response = await fetch(`${API_BASE}${endpoint}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setData(prev => prev.filter(item => item.id !== id));
      return true;
    } catch (err) {
      console.error(`Error deleting item:`, err);
      setError(err.message);
      return false;
    }
  };

  useEffect(() => {
    fetchData();
  }, [endpoint, token]);

  return {
    data,
    loading,
    error,
    createItem,
    updateItem,
    deleteItem,
    refetch: fetchData,
  };
}

// Specific hooks for each data type
export const useTasks = () => useApi('/tasks');
export const useNotes = () => useApi('/notes');
export const useHabits = () => useApi('/habits');
export const useWhiteboards = () => useApi('/whiteboards');
export const useFolders = (type) => useApi(`/folders?type=${type}`);
