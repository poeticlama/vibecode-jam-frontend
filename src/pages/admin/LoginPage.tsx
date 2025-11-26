const LoginPage = () => {
  return (
    <div className="mt-20 flex h-full w-full flex-col items-center gap-10">
      <h1 className="base text-primary text-4xl font-bold">Вход</h1>
      <div className="w-90 p-7 shadow-xl">
        <fieldset className="fieldset">
          <label className="label">Логин</label>
          <input
            type="name"
            className="input mb-5"
            placeholder="Введите логин"
          />

          <label className="label">Пароль</label>
          <input
            type="password"
            className="input mb-3"
            placeholder="Введите пароль"
          />

          <button className="btn btn-primary mt-4">Войти</button>
        </fieldset>
      </div>
    </div>
  );
};

export default LoginPage;
