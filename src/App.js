import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useStore } from './context/AppContext';
import LoginPage from './pages/LoginPage';
import AppointmentsPage from './pages/AppointmentsPage';
import CreateAppointmentPage from './pages/CreateAppointmentPage';

const PrivateRoute = observer(function PrivateRoute({ children }) {
  const { currentUser } = useStore();
  if (!currentUser) {
    return <Navigate to="/" replace />;
  }
  return children;
});

const App = observer(function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route
        path="/appointments"
        element={
          <PrivateRoute>
            <AppointmentsPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/appointments/new"
        element={
          <PrivateRoute>
            <CreateAppointmentPage />
          </PrivateRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
});

export default App;
