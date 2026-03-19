import React, { createContext, useContext, useState, useCallback } from 'react';

const AppContext = createContext(null);

const defaultEmployees = [
  {
    id: '1',
    name: 'Анна',
    login: 'anna',
    password: 'anna123',
    services: ['Стрижка', 'Окрашивание', 'Укладка'],
  },
  {
    id: '2',
    name: 'Мария',
    login: 'maria',
    password: 'maria123',
    services: ['Стрижка', 'Маникюр', 'Укладка'],
  },
];

const defaultClients = [
  { id: '1', name: 'Иван Петров', phone: '+7 999 111-22-33' },
  { id: '2', name: 'Елена Сидорова', phone: '+7 999 222-33-44' },
  { id: '3', name: 'Ольга Козлова', phone: '+7 999 333-44-55' },
];

export function AppProvider({ children }) {
  const [employees, setEmployees] = useState(defaultEmployees);
  const [clients, setClients] = useState(defaultClients);
  const [appointments, setAppointments] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  const registerEmployee = useCallback((name, login, password, services) => {
    const newEmployee = {
      id: String(Date.now()),
      name,
      login: login.trim().toLowerCase(),
      password,
      services: Array.isArray(services) ? services : [],
    };
    setEmployees((prev) => [...prev, newEmployee]);
    setCurrentUser(newEmployee);
    return { success: true, employee: newEmployee };
  }, []);

  const loginEmployee = useCallback((login, password) => {
    const loginNorm = login.trim().toLowerCase();
    const employee = employees.find(
      (e) => e.login === loginNorm && e.password === password
    );
    if (employee) {
      setCurrentUser(employee);
      return { success: true, employee };
    }
    return { success: false };
  }, [employees]);

  const logout = useCallback(() => {
    setCurrentUser(null);
  }, []);

  const addClient = useCallback((name, phone) => {
    const newClient = {
      id: String(Date.now()),
      name: name.trim(),
      phone: (phone || '').trim(),
    };
    setClients((prev) => [...prev, newClient]);
    return newClient;
  }, []);

  const addAppointment = useCallback((employeeId, clientId, serviceIds, dateTime) => {
    const newAppointment = {
      id: String(Date.now()),
      employeeId,
      clientId,
      serviceIds: Array.isArray(serviceIds) ? serviceIds : [serviceIds],
      dateTime,
      createdAt: new Date().toISOString(),
    };
    setAppointments((prev) => [...prev, newAppointment]);
    return newAppointment;
  }, []);

  const getAppointmentsByEmployee = useCallback(
    (employeeId) =>
      appointments.filter((a) => a.employeeId === employeeId),
    [appointments]
  );

  const value = {
    employees,
    clients,
    appointments,
    currentUser,
    registerEmployee,
    loginEmployee,
    logout,
    addClient,
    addAppointment,
    getAppointmentsByEmployee,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
