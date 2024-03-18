import { Link } from "react-router-dom";
import "./homePage.css"

const Home = () => {

  return (
    <section className="phone">
      <div className="home__welcome">
        <p>WELCOME TO</p>
        <img
            alt="Korean Making logo"
            src="/images/logo.png"
            className="home__welcome__logo"
        />
      </div>
      <div className="buttons-container">
        <Link to="/login" className="home__button home__login__button">
          Login
        </Link>
        <Link to="/register" className="home__button home__register__button">
          Signup
        </Link>
      </div>
      <div></div>
    </section>
  );
};

export default Home;