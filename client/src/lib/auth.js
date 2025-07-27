
const API_BASE = 'http://localhost:3000/api';

export const authService = {
  async signup(email, password, full_name) {
    try {
      const response = await fetch(`${API_BASE}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, full_name }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Signup failed');
      }

      // Store token in localStorage
      localStorage.setItem('focusflow-token', data.token);
      localStorage.setItem('focusflow-user', JSON.stringify(data.user));

      return data;
    } catch (error) {
      throw error;
    }
  },

  async login(email, password) {
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Store token in localStorage
      localStorage.setItem('focusflow-token', data.token);
      localStorage.setItem('focusflow-user', JSON.stringify(data.user));

      return data;
    } catch (error) {
      throw error;
    }
  },

  logout() {
    localStorage.removeItem('focusflow-token');
    localStorage.removeItem('focusflow-user');
  },

  getToken() {
    return localStorage.getItem('focusflow-token');
  },

  getUser() {
    const user = localStorage.getItem('focusflow-user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated() {
    return !!this.getToken();
  }
};
