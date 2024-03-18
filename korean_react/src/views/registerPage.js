import { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import "./registerPage.css"

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { registerUser } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    registerUser(username, email, password);
  };

  return (
    <section className="register__phone">
      <form onSubmit={handleSubmit} className="register-form">
        <span>Signup</span>
        <hr />
        <div className="form-group">
          <label htmlFor="username">ID</label>
          <input
            type="text"
            id="username"
            onChange={(e) => setUsername(e.target.value)}
            placeholder="ID"
            required
            className="input-field form-control"
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">E-mail</label>
          <input
            type="email"
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="input-field form-control"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="input-field form-control"
          />
        </div>
        <button type="submit" className="register-button fs-5 mt-3">
          Signup
        </button>
      </form>
    </section>
  );
}

export default Register;
