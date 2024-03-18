import React, { useState, useEffect, useContext } from 'react'
import AuthContext from "../context/AuthContext";
import Modal from 'react-bootstrap/Modal';
import { Link } from 'react-router-dom';
import "./modal.css"

export default function CustomModal(props) {
    const [userInfo, setUserInfo] = useState('')
    const showParaphraseContent = props['data-showparaphrasecontent'];
    const result = props['result']
    const page = props['page']
    const edited = props['edited']
    let { authTokens, user } = useContext(AuthContext)
    console.log(111, showParaphraseContent, result, page)
    
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
            setUserInfo(data)
          })
          .catch((error) => {
            console.error('Error fetching recommended sentence:', error);
          });
      }
    }, []);

    const calculateExp = () => {
      if (page === 'writing') {
        if (result.score) {
          if (edited) {
            return 10
          } else {
            return 5
          }
        } else {
          return 0
        }
      } else {
       if (result) {
          return (result.score/10).toFixed(0)
        } else {
          return 0
        }
      }
    }

    const ColorDecider = () => {
      if (page === 'writing') {
        if (result.score) {
          return "modal__green modal__container"
        } else {
        return "modal__red modal__container"
        }
      } else {
        if (result) {
          if (result.score >= 50) {
            return "modal__green modal__container"
          } else {
            return "modal__red modal__container"
          }
        } else {
          return "modal__red modal__container"
        }
      }
    } 


    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Body className={ColorDecider()}>

          {page === "writing" ? (
            <div className='modal__writing__box'>
              <p className='mt-5 mb-2 display-3'>{result.score ? 'Congratulations!' : 'Nope!'}</p>
              <p className='mb-4 display-5'>{result.score ?  'It is a paraphrase' : 'It is not a paraphrase'}</p>
              <p className='mb-4 fs-3'>+ {calculateExp()} exp</p>
              <Link className='my-4 btn fs-3 modal__button' to="/result" state={{ result: result, page: 'writing', userInfo: userInfo }}>
                <span className='fs-3'>Continue</span>
              </Link>
            </div>
            ) : (
            <div className='modal__writing__box'>
              <p className='mt-5 mb-2 display-4'>{result ? 'SCORE': ''}</p>
              <p className='mb-3 display-2'>{result ? result.score : 'Fail'}</p>
              <p className='mb-4 display-6'>{result ? 'oh~ 조선에서 오셨나요?' : '다시 시도해주세요!'}</p>
              <p className='mb-4 fs-3'>+ {calculateExp()} exp</p>
              <Link className='my-4 btn fs-3 modal__button' to="/result" state={{ result: result, page: 'speaking', userInfo: userInfo }}>
                Continue
              </Link>
            </div>
          )}
          
        </Modal.Body>
      </Modal>
    );
  }