import React, { useState, useEffect, useContext } from 'react';
import AuthContext from "../context/AuthContext";
import { useLocation } from 'react-router-dom';
import "./ResultPage.css"

export default function ResultPage() {
    const [userInfo, setUserInfo] = useState({});
    const [writing, setWriting] = useState([]);
    const [speaking, setSpeaking] = useState([]);
    let { authTokens, user } = useContext(AuthContext)
    console.log(userInfo)
    const location = useLocation()
    const data = location.state?.result
    const page = location.state?.page
    console.log(1313, data, page)

    useEffect(() => {
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
            setWriting(data.writing)
            setSpeaking(data.speaking)
          })
          .catch((error) => {
            console.error('Error fetching recommended sentence:', error);
          });
      }, []);

      const decideColor = (result) => {
        if (result) {
          if (page === "writing") {
            if (result.score === false) {
              return "result__box result__box__red"
            } else {
              return "result__box result__box__blue"
            }
          } else {
            if (result.score > 60) {
              return "result__box result__box__blue"
            } else {
              return "result__box result__box__red"
            }
          }
        } 
      }

      return (
        <div className="result__container">
          <div className="result__box-container">
            <h1 className='my-4'>RECENT SCORES</h1>
            <div className='result__middle d-flex flex-column'>
              {page === "writing"
                ? writing.slice(-6,-1).map((result, index) => (
                  <div className={decideColor(result)} key={result.id}>
                      <p className='result__box__input mx-2'>{result.input_sentence}</p>
                      <div className='result__box__score mx-2'>{result.score === true ? "Pass" : "Fail"}</div>
                  </div>
                  ))
                  : speaking.slice(-6,-1).map((result, index) => (
                    <div className={decideColor(result)} key={result.id}>
                      <p className='result__box__input mx-3'>{result.input_script}</p>
                      <div className='result__box__score mx-3'>{result.score} 점</div>
                  </div>
                  ))}
            </div>
          </div>
      
          <div className='recent__result__box'>
            <div className='recent__result__box__1'>Most Recent Answer</div>
            <div className='recent__result__box__3'>
            {page === "writing" ? 
              data.input_sentence
              : 
              ""
            }
            {page === "speaking" ? 
              data.input_script
              : 
              ""
            }
            </div>
            <div className='recent__result__box__2'>
            {page === "writing" ? 
              (data.score === true ? "Pass" : "Fail")
              : 
              ""
            }
            {page === "speaking" ? 
              `${data.score} 점`
              : 
              ""
            }
            </div>
          </div>
      
          <a href={page === "writing" ? "/writing" : "/speaking"} className="page__link">
            Back to {page === "writing" ? "Writing" : "Speaking"}
          </a>
        </div>
      );
}