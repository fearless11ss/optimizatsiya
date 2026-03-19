import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useStore } from '../context/AppContext';
import './CreateAppointmentPage.css';

function CreateAppointmentPage() {
  const navigate = useNavigate();
  const { currentUser, clients, addAppointment } = useStore();
  const [clientId, setClientId] = useState('');
  const [serviceIds, setServiceIds] = useState([]);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [error, setError] = useState('');

  const masterServices = currentUser?.services || [];

  const toggleService = (s) => {
    setServiceIds((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!clientId) {
      setError('Выберите клиента');
      return;
    }
    if (serviceIds.length === 0) {
      setError('Выберите хотя бы одну услугу');
      return;
    }
    if (!date || !time) {
      setError('Укажите дату и время');
      return;
    }
    const dateTime = `${date}T${time}:00`;
    if (new Date(dateTime) <= new Date()) {
      setError('Дата и время записи должны быть в будущем');
      return;
    }
    addAppointment(currentUser.id, clientId, serviceIds, dateTime);
    navigate('/appointments', { replace: true });
  };

  return (
    <div className="create-appointment-page">
      <header className="page-header">
        <button type="button" className="btn-back" onClick={() => navigate('/appointments')}>
          ← Назад
        </button>
        <h1>Новая запись</h1>
        <p className="master-name">Мастер: {currentUser?.name}</p>
      </header>

      <div className="create-appointment-card">
        <form onSubmit={handleSubmit} className="create-form">
          <label>
            Клиент
            <select
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              required
            >
              <option value="">— Выберите клиента —</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} {c.phone ? `(${c.phone})` : ''}
                </option>
              ))}
            </select>
          </label>

          <div className="services-block">
            <span className="label-text">Услуги:</span>
            <div className="services-checkboxes">
              {masterServices.map((s) => (
                <label key={s} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={serviceIds.includes(s)}
                    onChange={() => toggleService(s)}
                  />
                  {s}
                </label>
              ))}
            </div>
            {masterServices.length === 0 && (
              <p className="hint">У вас пока нет услуг. Добавьте их в профиле.</p>
            )}
          </div>

          <label>
            Дата
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </label>
          <label>
            Время
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />
          </label>

          {error && <p className="form-error">{error}</p>}
          <button type="submit" className="btn-primary">
            Оформить запись
          </button>
        </form>
      </div>
    </div>
  );
}

export default observer(CreateAppointmentPage);
