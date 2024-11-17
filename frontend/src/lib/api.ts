import axios from "axios";
import { AuthResponse, Car } from "./types";

const BASE_URL = 'http://localhost:5000/api'; // Make sure this matches your backend URL

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth API to handle login and register
export const auth = {
  register: async (name: string, email: string, password: string, confirmPassword: string) => {
    return axios.post(`${BASE_URL}/auth/register`, {
      name,
      email,
      password,
      confirmPassword,
    });
  },

  login: (email: string, password: string) =>
    api.post<AuthResponse>("/users/login", { email, password }),
};

export const cars = {
  // Create a new car
  create: async (formData: FormData) => {
    try {
      const response = await api.post<Car>('/cars', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      console.error('Error creating car:', error);
      throw new Error('Failed to create car');
    }
  },

  // List all cars, optionally filtered by a search term
  list: async (search?: string) => {
    try {
      const response = await api.get<Car[]>('/cars', {
        params: { search },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching cars:', error);
      throw new Error('Failed to fetch cars');
    }
  },

  // Get a single car by ID
  get: async (id: string) => {
    try {
      const response = await api.get<Car>(`/cars/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching car with ID ${id}:`, error);
      throw new Error('Failed to fetch car');
    }
  },

  // Update a car by ID
  update: async (id: string, formData: FormData) => {
    try {
      const response = await api.put<Car>(`/cars/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      console.error(`Error updating car with ID ${id}:`, error);
      throw new Error('Failed to update car');
    }
  },

  // Delete a car by ID
  delete: async (id: string) => {
    try {
      const response = await api.delete(`/cars/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting car with ID ${id}:`, error);
      throw new Error('Failed to delete car');
    }
  },
};