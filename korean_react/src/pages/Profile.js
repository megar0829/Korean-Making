import React, { useState, useEffect, useContext, useCallback } from 'react';
import AuthContext from "../context/AuthContext";
import ProgressBar from 'react-bootstrap/ProgressBar';
import { Link } from 'react-router-dom';
import "./Profile.css"

export default function Profile() {
  const [userInfo, setUserInfo] = useState()
  const [exp, setExp] = useState(null);
  const [nickname, setNickname] = useState('')
  const [tiername, setTiername] = useState('')
  
  let { authTokens, user } = useContext(AuthContext)

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
          setUserInfo(data)
        })
        .catch((error) => {
          console.error('Error fetching recommended sentence:', error);
        });
    }
  }, []);

  const ExpBarNum = () => {
    if ((0 < exp && exp <= 20)) {
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
  }, [UpdateTierName, user])

  return (
    <div className='profile__container'>
      <div className='profile__image'>
        <a href="/tier">
          {exp !== null && (
            <img alt="profile__image" src={ChooseProfileImage()} className='profile__image__tier'/>
          )}
        </a>
      </div>
      <div className='profile__name'>
        <p>{nickname}</p>
        <a href="/tier" className='profile__name__tiername'>{tiername}</a>
        <div >
          <ProgressBar striped variant="info" now={ExpBarNum()} className='profile__name__bar'/>
          <span className='fw-bold'>{ ExpBarNum() !== undefined ? ExpBarNum().toFixed(2) + '%' : 'N/A' }</span>
        </div>
      </div>
      <Link to="/score" state={{ user: userInfo, page: 'speaking' }} className='profile__record'>
        Speaking Records
      </Link>
      <Link to="/score" state={{ user: userInfo, page: 'writing' }} className='profile__record'>
        Writing Records
      </Link>
    </div>
  )
}