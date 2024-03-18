import React, { useState, useEffect, useContext } from 'react';
import AudioRecorder from "../components/Audio";
import AuthContext from "../context/AuthContext";
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import "./Speaking.css";

const Speaking = () => {
  const [recommendedSentence, setRecommendedSentence] = useState('recommended sentence');
  const { authTokens } = useContext(AuthContext);

  useEffect(() => {
    if (authTokens) {
      fetchRandomSentence();
    }
  }, [authTokens]);

  const fetchRandomSentence = () => {
    fetch('http://localhost:8000/educations/speaking/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + String(authTokens.access)
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const randomIndex = Math.floor(Math.random() * data.length);
        setRecommendedSentence(data[randomIndex].ko_sentence);
        console.log(data);
      })
      .catch((error) => {
        console.error('Error fetching recommended sentence:', error);
      });
  };

  const handleNewRecommendedSentenceClick = () => {
    fetchRandomSentence();
  };

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Speak the recommended sentence in 5 seconds
    </Tooltip>
  );

  return (
    <div className='speaking__container'>
      <div className='speaking__image'>
        <AudioRecorder recommendedSentence={recommendedSentence}/>
        <div className='speaking__explanation'>
          <button onClick={handleNewRecommendedSentenceClick} className='speaking__toggle writing__recommend__buttons'>
            <img src="images/refresh.png" alt="edit" className='writing__recommend__img'/>
          </button>
          <OverlayTrigger
            placement="right"
            delay={{ show: 250, hide: 400 }}
            overlay={renderTooltip}
          >
            <Button variant="success" className='speaking__question'>?</Button>
          </OverlayTrigger>
        </div>
      </div>
      {(
        <div className='speaking__input'>
          <p>You should say: </p>
          <p className='speaking__input__text'>{ recommendedSentence }</p>
        </div>
      )}
    </div>
  );
};

export default Speaking;
