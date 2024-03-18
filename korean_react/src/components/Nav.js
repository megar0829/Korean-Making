import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from "react-router-dom";
import ProgressBar from 'react-bootstrap/ProgressBar';
import AuthContext from "../context/AuthContext";
import "./Nav.css";

export default function Nav() {
  const [exp, setExp] = useState(null);
  const [tiername, setTiername] = useState('')

  const navigate = useNavigate();
  let { authTokens, user } = useContext(AuthContext)

  const handleLogoClick = () => {
    navigate('/main');
  };

  useEffect(() => {
    if (authTokens) {
      fetch(`http://127.0.0.1:8000/api/profile/${user}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + String(authTokens.access)
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          setExp(data.exp)
        })
        .catch((error) => {
          console.error('Error fetching recommended sentence:', error);
        });
    }
  }, []);

  const ExpBarNum = () => {
    if (0 < exp && exp <= 20) {
      return (exp/20)*100
    } else if ( 20 < exp && exp <= 70) {
      return ((exp - 20)/50)*100
    } else if ( 70 < exp && exp <= 150) {
      return ((exp - 70)/80)*100
    } else if ( 150 < exp && exp <= 300) {
      return ((exp - 150)/150)*100
    } else if ( 300 < exp && exp <= 450) {
      return ((exp - 300)/150)*100
    } else if ( 450 < exp && exp <= 700) {
      return ((exp - 450)/250)*100
    } else if ( 700 < exp && exp <= 1000) {
      return ((exp - 700)/300)*100
    } else if ( 1000 < exp ) {
      return 100
    }
  }

  const ChooseProfileImage = () => {
    if (exp <= 20) {
      return "images/tier/tier_1.jpg"
    } else if ( 20 < exp && exp <= 70) {
      return "images/tier/tier_2.jpg"
    } else if ( 70 < exp && exp <= 150) {
      return "images/tier/tier_3.jpg"
    } else if ( 150 < exp && exp <= 300) {
      return "images/tier/tier_4.jpg"
    } else if ( 300 < exp && exp <= 450) {
      return "images/tier/tier_5.jpg"
    } else if ( 450 < exp && exp <= 700) {
      return "images/tier/tier_6.jpg"
    } else if ( 700 < exp && exp <= 1000) {
      return "images/tier/tier_7.jpg"
    } else if ( 1000 < exp ) {
      return "images/tier/tier_7.jpg"
    }   
  }

  const UpdateTierName = useCallback(() => {
    if (exp <= 20) {
      return "평민"
    } else if ( 20 < exp && exp <= 70) {
      return "상민"
    } else if ( 70 < exp && exp <= 150) {
      return "양반"
    } else if ( 150 < exp && exp <= 300) {
      return "무관"
    } else if ( 300 < exp && exp <= 450) {
      return "문관"
    } else if ( 450 < exp && exp <= 700) {
      return "세자"
    } else if ( 700 < exp && exp <= 1000) {
      return "왕"
    } else if ( 1000 < exp ) {
      return "왕"
    }   
  }, [exp])

  useEffect(()=>{
    setTiername(UpdateTierName())
  }, [UpdateTierName])

  return (
    <nav className={`nav `}>
      <img
        alt="Korean Making logo"
        src="/images/logo.png"
        className="nav__logo"
        onClick={handleLogoClick}
      />
      <a href="/Profile" className="nav_progressbar">
        <div className='nav_progressbar__box'>
          {exp !== null && (
            <img src={ChooseProfileImage()} alt="tier_image" className='nav__progressbar__image'/>
          )}
          <div className='nav__progressbar__bottom__div'> 
            <span className='nav_progressbar__box__tier ps-3 pe-2'>
              {tiername}
            </span>
            <div className='nav__progressbar__bar'>
              {exp !== null && (
                <ProgressBar striped variant="info" now={ExpBarNum()} />
              )}
            </div>
          </div>
        </div>
      </a>
    </nav>
  );
}