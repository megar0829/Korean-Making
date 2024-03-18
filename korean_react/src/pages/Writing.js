import React, { useState, useEffect, useContext } from 'react';
import { useNavigate  } from 'react-router-dom';
import AuthContext from "../context/AuthContext";
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import './Writing.css';

export default function Writing() {
  const [recommendedSentence, setRecommendedSentence] = useState('recommended sentence');
  const [translatedSentence, setTranslatedSentence] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [result, setResult] = useState({})
  const [isEditingRecommendedSentence, setIsEditingRecommendedSentence] = useState(false);
  const [editedRecommendedSentence, setEditedRecommendedSentence] = useState('');
  let { authTokens } = useContext(AuthContext)
  
  const navigate  = useNavigate();

  const fetchRecommendedSentence = () => {
    fetch('http://localhost:8000/educations/writing/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + String(authTokens.access)
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const randomIndex = Math.floor(Math.random() * data.length);
        setRecommendedSentence(data[randomIndex].en_sentence);
      })
      .catch((error) => {
        console.error('Error fetching recommended sentence:', error);
      });
  };

  useEffect(() => {
    fetchRecommendedSentence();
  }, []);

  useEffect(() => {
    setEditedRecommendedSentence(recommendedSentence)
  }, [recommendedSentence])

  const handleEditRecommendedSentence = () => {
    setIsEditingRecommendedSentence(true);
    setEditedRecommendedSentence(recommendedSentence);
  };

  const handleTranslateChange = (event) => {
    setTranslatedSentence(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (authTokens) {
      fetch("http://localhost:8000/educations/writing/", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + String(authTokens.access)
        },
        body: JSON.stringify({
          en_sentence: editedRecommendedSentence,
          input_sentence: translatedSentence,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('Server response:', data);
          setResult(data)
          setModalVisible(true);
        })
        .catch((error) => {
          console.error('Error submitting data:', error);
        });
    }
  };

  const handleNewRecommendedSentenceClick = () => {
    fetchRecommendedSentence();
  };

  const showAlert = () => {
    const isPass = result.score;

    Swal.fire({
      title: isPass ? 'Pass' : 'Fail',
      text: isPass ? '+10 exp' : '+0 exp',
      showCancelButton: false,
      confirmButtonText: 'Continue',
      confirmButtonColor: '#3085d6',
    }).then((res) => {
      if (res.isConfirmed) {
        navigate('/result', { state: { result, page: 'writing', edited : 'isEditingRecommendedSentence'} });
        setModalVisible(false);
      }
    });
  };

  if (modalVisible) {
    showAlert();
  }

  return (
    <div className='writing__container'>
      <div className='writing__recommend'>
        <div className='writing__recommend__top'>
          {isEditingRecommendedSentence ? (
            <input
            type="text"
            value={editedRecommendedSentence}
            onChange={(event) => setEditedRecommendedSentence(event.target.value)}
            className='writing__recommend__input'
            />
            ) : (
              <>
              {recommendedSentence}
            </>
          )}
        </div>
        <div className='writing__recommend__bottom'>
          <button onClick={handleEditRecommendedSentence} className='writing__recommend__buttons'>
            <img src="images/edit.png" alt="edit" className='writing__recommend__img'/>
          </button>
          <button onClick={handleNewRecommendedSentenceClick} className='writing__recommend__buttons'>
            <img src="images/refresh.png" alt="edit" className='writing__recommend__img'/>
          </button>
        </div>
      </div>
      <form className='writing__translate' onSubmit={handleSubmit}>
        <label htmlFor='translatedSentence'>Type in your translated sentence</label>
        <input
          type='text'
          id='translatedSentence'
          name='translatedSentence'
          className='writing__translate__input'
          onChange={handleTranslateChange}
          value={translatedSentence}
        />
        <button onClick={handleSubmit} className='writing__submit__button btn shadow-2'>Submit</button>
      </form>
    </div>
  );
}
