import { useState, useEffect, useContext } from "react";
import { useNavigate  } from 'react-router-dom';
import Axios from "axios";
import CustomModal from "../components/modal";
import AuthContext from "../context/AuthContext";
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import "./Audio.css";

const AudioRecorder = ({ recommendedSentence }) => {
  const [recordingStatus, setRecordingStatus] = useState("inactive");
  const [modalVisible, setModalVisible] = useState(false);
  const [result, setResultFromBackend] = useState(null);
  const navigate  = useNavigate();

  let { authTokens } = useContext(AuthContext);

  const startRecording = async () => {
    try {
      setRecordingStatus("recording");
      const response = await Axios.post(
        "http://localhost:8000/educations/speaking/",
        {
          start: true,
          input_script: recommendedSentence,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + String(authTokens.access),
          },
        }
      );

      if (response.status === 200) {
        const responseData = response.data;

        setRecordingStatus("inactive");
        setResultFromBackend(responseData);
        setModalVisible(true);
      } else {
        console.error("Failed to start recording.");
      }
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };
  
  const showAlert = () => {
    Swal.fire({
      title: 'Your Score',
      text: `Score: ${result.score}`,
      showCancelButton: false,
      confirmButtonText: 'Continue',
      confirmButtonColor: '#3085d6',
    }).then((res) => {
      if (res.isConfirmed) {
        navigate('/result', { state: { result, page: 'speaking'} });
        setModalVisible(false);
      }
    });
  };

  if (modalVisible) {
    showAlert();
  }

  return (
    <div className="audio__controls">
      {recordingStatus === "inactive" ? (
        <button onClick={startRecording} type="button" className="audio__mike__start">
          <img 
            src="/images/mike.png" 
            alt="mike"
            style={{ width: "100px" }}
          />
        </button>
      ) : (
        <button type="button" className="audio__mike__stop">
          <img 
            src="/images/mike.png" 
            alt="mike"
            style={{ width: "100px" }}
          />
        </button>
      )}
      {/* {modalVisible && (
        <CustomModal
          show={modalVisible}
          data-showparaphrasecontent={false}
          result={resultFromBackend}
        />
      )} */}
    </div>
  );
};

export default AudioRecorder;
