import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useStore } from '../context/AppContext';
import './LoginPage.css';

const SERVICE_OPTIONS = ['Стрижка', 'Окрашивание', 'Укладка', 'Маникюр', 'Педикюр'];

function LoginPage() {
  const navigate = useNavigate();
  const { loginEmployee, registerEmployee } = useStore();
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [services, setServices] = useState([]);
  const [error, setError] = useState('');

  const toggleService = (s) => {
    setServices((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (mode === 'login') {
      const result = loginEmployee(login, password);
      if (result.success) {
        navigate('/appointments', { replace: true });
      } else {
        setError('Неверный логин или пароль');
      }
    } else {
      if (!name.trim() || !login.trim() || !password.trim()) {
        setError('Заполните имя, логин и пароль');
        return;
      }
      const exists = registerEmployee(name, login, password, services);
      if (exists) {
        navigate('/appointments', { replace: true });
      }
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Салон</h1>
        <p className="login-subtitle">
          {mode === 'login' ? 'Вход для сотрудников' : 'Регистрация сотрудника'}
        </p>

        <div className="login-tabs">
          <button
            type="button"
            className={mode === 'login' ? 'active' : ''}
            onClick={() => { setMode('login'); setError(''); }}
          >
            Вход
          </button>
          <button
            type="button"
            className={mode === 'register' ? 'active' : ''}
            onClick={() => { setMode('register'); setError(''); }}
          >
            Регистрация
          </button>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {mode === 'register' && (
            <label>
              Имя
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Имя мастера"
                autoComplete="name"
              />
            </label>
          )}
          <label>
            Логин
            <input
              type="text"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              placeholder="Логин"
              autoComplete="username"
            />
          </label>
          <label>
            Пароль
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Пароль"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            />
          </label>
          {mode === 'register' && (
            <div className="services-block">
              <span className="label-text">Услуги:</span>
              <div className="services-checkboxes">
                {SERVICE_OPTIONS.map((s) => (
                  <label key={s} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={services.includes(s)}
                      onChange={() => toggleService(s)}
                    />
                    {s}
                  </label>
                ))}
              </div>
            </div>
          )}
          {error && <p className="form-error">{error}</p>}
          <button type="submit" className="btn-primary">
            {mode === 'login' ? 'Войти' : 'Зарегистрироваться'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default observer(LoginPage);
