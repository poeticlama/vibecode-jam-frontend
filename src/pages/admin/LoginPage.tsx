import { useState, type FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router';

import { useLoginMutation } from '../../store/api/endpoints/auth.api.ts';
import { useAppSelector } from '../../hooks/rtk.ts';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [login, { isLoading, error }] = useLoginMutation();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  // Если уже авторизован, перенаправляем
  if (isAuthenticated) {
    const from = (location.state as { from?: Location })?.from?.pathname || '/admin';
    navigate(from, { replace: true });
    return null;
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await login({ username, password }).unwrap();
      // После успешного логина перенаправляем
      const from = (location.state as { from?: Location })?.from?.pathname || '/admin';
      navigate(from, { replace: true });
    } catch (err) {
      // Ошибка обрабатывается через error из useLoginMutation
      console.error('Login failed:', err);
    }
  };

  return (
    <div className="mt-20 flex h-full w-full flex-col items-center gap-10">
      <h1 className="base text-primary text-4xl font-bold">Вход</h1>
      <div className="w-90 p-7 shadow-xl">
        <form onSubmit={handleSubmit}>
          <fieldset className="fieldset">
            <label className="label">Логин</label>
            <input
              type="text"
              className="input mb-5"
              placeholder="Введите логин"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={isLoading}
            />

            <label className="label">Пароль</label>
            <input
              type="password"
              className="input mb-3"
              placeholder="Введите пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />

            {error && (
              <div className="mb-3 text-sm text-red-500">
                {'data' in error
                  ? (error.data as { message?: string })?.message || 'Ошибка входа'
                  : 'Ошибка входа'}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary mt-4"
              disabled={isLoading}
            >
              {isLoading ? 'Вход...' : 'Войти'}
            </button>
          </fieldset>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
