import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import "./Score.css"

export default function Score() {
    const location = useLocation()
    const [writing, setWriting] = useState([]);
    const [speaking, setSpeaking] = useState([]);
    const user = location.state?.user
    const page = location.state?.page
    console.log(1212, user, page)

    useEffect(()=> {
        setWriting(user.writing)
        setSpeaking(user.speaking)
    }, [user])

    const decideColor = (result) => {
        if (result) {
          if (page === "writing") {
            if (result.score === false) {
              return "score__box score__box__red d-flex flex-column"
            } else {
              return "score__box score__box__blue d-flex flex-column"
            }
          } else {
            if (result.score > 60) {
              return "score__box score__box__blue d-flex flex-column"
            } else {
              return "score__box score__box__red d-flex flex-column"
            }
          }
        } 
      }

  return (
    <div className='total__container'>
        <div className='my-3'>
            <div className='score__top'>
                <span className='fs-2'>
                    {page === "writing" ? 
                        "Writing Records"
                        : 
                        "Speaking Records"
                    }
                </span>
            </div>
            <div>
                <a href="/profile" className="back__btn btn btn-secondary">
                    Back
                </a>
            </div>
        </div>
        <div className='score__container'>
            <div className='score__middle'>
                {   page === "writing" ? 
                    (writing.map((result,index) => (
                        <div className={decideColor(result)} key={result.id}>
                            <div className='writing__box d-flex flex-row justify-content-start'>
                                <span>Q : </span>
                                <span className='answer__box flex-grow-1 text-start fs-6 col-9 ps-1 pe-0'>
                                    {result.recommend.en_sentence}
                                </span>
                            </div>
                            <div className='writing__box d-flex flex-row justify-content-start'>
                                <span>A :</span>
                                <span className='answer__box flex-grow-1 text-start fs-6 col-9 ps-1 pe-0'>
                                    {result.input_sentence}
                                </span>
                            </div>
                            {/* <span className='fs-6 col-2 ps-3 text-start'>
                                {result.score === true ? "Pass" : "Fail"}
                            </span> */}
                        </div>
                    ))
                    ) : (speaking.map((result,index) => (
                        <div className={decideColor(result)} key={result.id}>
                            <div className='writing__box d-flex flex-row justify-content-between'>
                                <span className='flex-grow-1 fs-6 col-9 ps-2 pe-0 text-start'>
                                    {result.input_script}
                                </span>
                                <span className='fs-6 col-2 ps-0 pe-2 text-end'>
                                    {result.score}점
                                </span>
                            </div>
                        </div>
                    ))
                    )
                }
            </div>
        </div>
    </div>
  )
}
