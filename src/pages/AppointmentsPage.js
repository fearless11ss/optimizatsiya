import React from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useStore } from '../context/AppContext';
import './AppointmentsPage.css';

function formatDateTime(dateTimeStr) {
  if (!dateTimeStr) return '—';
  const d = new Date(dateTimeStr);
  return d.toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function AppointmentsPage() {
  const navigate = useNavigate();
  const { currentUser, clients, getAppointmentsByEmployee, logout } = useStore();
  const myAppointments = getAppointmentsByEmployee(currentUser?.id) || [];

  const getClientName = (clientId) => {
    const c = clients.find((x) => x.id === clientId);
    return c ? c.name : 'Неизвестный клиент';
  };

  return (
    <div className="appointments-page">
      <header className="appointments-header">
        <div>
          <h1>Мои записи</h1>
          <p className="master-name">Мастер: {currentUser?.name}</p>
        </div>
        <button type="button" className="btn-logout" onClick={logout}>
          Выйти
        </button>
      </header>

      <div className="appointments-actions">
        <button
          type="button"
          className="btn-new"
          onClick={() => navigate('/appointments/new')}
        >
          + Новая запись
        </button>
      </div>

      <div className="appointments-list">
        {myAppointments.length === 0 ? (
          <p className="empty-state">
            Записей пока нет. Создайте первую запись.
          </p>
        ) : (
          myAppointments
            .slice()
            .sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime))
            .map((apt) => (
              <div key={apt.id} className="appointment-card">
                <div className="card-client">{getClientName(apt.clientId)}</div>
                <div className="card-services">
                  {Array.isArray(apt.serviceIds)
                    ? apt.serviceIds.join(', ')
                    : apt.serviceIds}
                </div>
                <div className="card-datetime">
                  {formatDateTime(apt.dateTime)}
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
}

export default observer(AppointmentsPage);
