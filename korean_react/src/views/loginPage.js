import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import "./loginPage.css";

const LoginPage = () => {
  const { loginUser } = useContext(AuthContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;
    username.length > 0 && loginUser(username, password);
  };

  return (
    <section className="login__phone">
      <form onSubmit={handleSubmit} className="login-form">
        <span>Login</span>
        <div className="form-group">
          <label htmlFor="username">ID</label>
          <input type="text" id="username" placeholder="Enter ID" className="input-field form-control" />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" placeholder="Enter Password" className="input-field form-control" />
        </div>
        <button type="submit" className="login-button fs-5 mt-3">
          Login
        </button>
      </form>
    </section>
  );
};

export default LoginPage;
