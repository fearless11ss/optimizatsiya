import React, { createContext, useContext } from 'react';
import { makeAutoObservable } from 'mobx';

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

class AppStore {
  employees = defaultEmployees;
  clients = defaultClients;
  appointments = [];
  currentUser = null;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  registerEmployee(name, login, password, services) {
    const newEmployee = {
      id: String(Date.now()),
      name,
      login: login.trim().toLowerCase(),
      password,
      services: Array.isArray(services) ? services : [],
    };
    this.employees = [...this.employees, newEmployee];
    this.currentUser = newEmployee;
    return { success: true, employee: newEmployee };
  }

  loginEmployee(login, password) {
    const loginNorm = login.trim().toLowerCase();
    const employee = this.employees.find(
      (e) => e.login === loginNorm && e.password === password
    );
    if (employee) {
      this.currentUser = employee;
      return { success: true, employee };
    }
    return { success: false };
  }

  logout() {
    this.currentUser = null;
  }

  addClient(name, phone) {
    const newClient = {
      id: String(Date.now()),
      name: name.trim(),
      phone: (phone || '').trim(),
    };
    this.clients = [...this.clients, newClient];
    return newClient;
  }

  addAppointment(employeeId, clientId, serviceIds, dateTime) {
    const newAppointment = {
      id: String(Date.now()),
      employeeId,
      clientId,
      serviceIds: Array.isArray(serviceIds) ? serviceIds : [serviceIds],
      dateTime,
      createdAt: new Date().toISOString(),
    };
    this.appointments = [...this.appointments, newAppointment];
    return newAppointment;
  }

  getAppointmentsByEmployee(employeeId) {
    return this.appointments.filter((a) => a.employeeId === employeeId);
  }
}

const AppContext = createContext(null);
const appStore = new AppStore();

export function AppProvider({ children }) {
  return (
    <AppContext.Provider value={appStore}>
      {children}
    </AppContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useStore must be used within AppProvider');
  return ctx;
}
