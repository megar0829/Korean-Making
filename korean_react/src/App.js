import React from "react";
import "./index.css";
import { BrowserRouter as Router, Route, Routes, Outlet } from "react-router-dom";
import { AuthProvider} from "./context/AuthContext";
import Home from "./views/homePage";
import Login from "./views/loginPage";
import Register from "./views/registerPage";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import MainPage from './pages/MainPage';
import Speaking from './pages/Speaking';
import Writing from './pages/Writing';
import Profile from './pages/Profile';
import Tier from './pages/Tier';
import ResultPage from './pages/ResultPage';
import Score from './components/Score';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  
  return (
    <Router>
      <div className="App">
        <AuthProvider>
          <Routes>
            <Route index element={<Home />} />
            <Route element={<Login />} path="/login" />
            <Route element={<Register />} path="/register" />
            <Route element={<Layout />}>
              <Route path="main" element={<MainPage />} />
              <Route path="speaking" element={<Speaking />} />
              <Route path="writing" element={<Writing />} />
              <Route path="profile" element={<Profile />} />
              <Route path="tier" element={<Tier />} />
              <Route path="result" element={<ResultPage />} />
              <Route path="score" element={<Score />} />
            </Route>
          </Routes>
        </AuthProvider>
      </div>
    </Router>
  );
}

const Layout = () => {
  return (
    <div className='phone'>
      <Nav />
      <Outlet />
      <Footer />
    </div>
  );
};



export default App;