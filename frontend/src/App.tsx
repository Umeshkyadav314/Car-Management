import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Layout } from './components/Layout';
import { LoginPage } from './pages/Login';
import { RegisterPage } from './pages/Signup';
import { CarListPage } from './pages/CarList';
import { CarDetailPage } from './pages/CarDetail';
import { CarFormPage } from './pages/CarForm';
import { useAuthStore } from './store/auth';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { token } = useAuthStore();
  return token ? <>{children}</> : <Navigate to="/login" />;
}

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route index element={<CarListPage />} />
          <Route path="cars/new" element={<CarFormPage />} />
          <Route path="cars/:id" element={<CarDetailPage />} />
          <Route path="cars/:id/edit" element={<CarFormPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;