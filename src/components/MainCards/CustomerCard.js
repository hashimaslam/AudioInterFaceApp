import React, { useState, useEffect, useContext } from "react";
import { ReactComponent as Send } from "../../assets/send.svg";
import MicRecorder from "mic-recorder-to-mp3";
import { ReactComponent as RecorderBtn } from "../../assets/radio.svg";
import { ReactComponent as ReRecord } from "../../assets/microphone.svg";
import { ReactComponent as Delete } from "../../assets/trash.svg";
import Lottie from "react-lottie";
import uuid from "react-uuid";
import * as recorderData from "../../assets/recorderwave.json";
// import util from "audio-buffer-utils";
import { GlobalContext } from "../../context/GlobalState";
const Mp3Recorder = new MicRecorder({ bitRate: 128 });

const CustomerCards = () => {
  const [RecordReady, setRecordReady] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isBlocked, SetBlocked] = useState(false);
  const [sinppets, Addsnippets] = useState([]);
  const [currMsg, setCurrMsg] = useState("");
  const [error, setErro] = useState(false);
  const [Rerecord, setRerecord] = useState(false);
  const [ReId, setReId] = useState("");
  let d = new Date();
  //main  context
  const maincontext = useContext(GlobalContext);

  //Adding snippet
  const handleClick = () => {
    console.log("clickeds");
    if (currMsg === "") {
      return setErro(true);
    }
    Addsnippets(prev => [
      ...prev,
      {
        id: uuid(),
        customer: currMsg,
        time: d.toUTCString(),
        url: ""
      }
    ]);
    setRecordReady(true);
    setCurrMsg("");
    setErro(false);
  };

  //Start recording
  const startRecord = () => {
    if (isBlocked) {
      console.log("Permission Denied");
    } else {
      Mp3Recorder.start()
        .then(() => {
          setIsRecording(true);
        })
        .catch(e => console.error(e));
    }
  };

  //stop Record
  const stopRecord = () => {
    let uid;
    Mp3Recorder.stop()
      .getMp3()
      .then(([buffer, blob]) => {
        console.log("stopped");

        const blobURL = URL.createObjectURL(blob);
        console.log(blobURL);

        let newSnipp = sinppets.map((item, index) => {
          if (index === sinppets.length - 1) {
            item.url = blobURL;
            uid = item.id;
          }
          return item;
        });
        Addsnippets(newSnipp);
        maincontext.addSnippets(newSnipp[newSnipp.length - 1]);
        maincontext.addBuffer({ id: uid, buffer: buffer });

        setRecordReady(false);
        setIsRecording(false);
      })
      .catch(err => console.log(err));
  };

  //Delete
  const handleDelete = i => {
    let newSnipp = sinppets.filter(item => {
      return item.id !== i;
    });
    Addsnippets(newSnipp);
    maincontext.deleteSnippets(i);
  };

  //Record
  const handleRerecord = i => {
    setRecordReady(true);
    setRerecord(true);
    setReId(i);
  };
  const stopRerecord = () => {
    Mp3Recorder.stop()
      .getMp3()
      .then(([buffer, blob]) => {
        console.log("Rerecord stopped");
        const blobURL = URL.createObjectURL(blob);
        console.log(blobURL);
        let newSnipp = sinppets.map(item => {
          if (item.id === ReId) {
            item.url = blobURL;
          }
          return item;
        });
        Addsnippets(newSnipp);
        maincontext.setRecord(ReId, blobURL, buffer);
        setRecordReady(false);
        setIsRecording(false);
        setRerecord(false);
        setReId("");
      })
      .catch(err => console.log(err));
  };

  //Side Effects to check for Audio Permission
  useEffect(() => {
    navigator.getUserMedia(
      { audio: true },
      () => {
        console.log("Permission Granted");
        SetBlocked(false);
      },
      () => {
        console.log("Permission Denied");
        SetBlocked(true);
      }
    );
  }, []);

  //Side Effects to check Data
  useEffect(() => {
    console.log(maincontext.GlobalSnippets);
    console.log(maincontext.GlobalBuffer);
  }, [maincontext.GlobalSnippets, maincontext.GlobalBuffer]);

  //lottie options
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: recorderData.default,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  };

  return (
    <>
      <section className="customercards-wrapper">
        <div className="customercards-wrapper-header">Customer</div>

        <div className="customercards-wrapper-section">
          {!sinppets.length && (
            <h1 style={{ marginRight: "7em", color: "white" }}>
              No Snippets yet
            </h1>
          )}
          {sinppets.map((item, index) => {
            return (
              <React.Fragment key={item.id}>
                <div>
                  <div
                    className="maincards-wrapper-section-delete"
                    onClick={() => handleDelete(item.id)}
                  >
                    <Delete />
                  </div>
                  <div
                    className="maincards-wrapper-section-rerecord"
                    onClick={() => handleRerecord(item.id)}
                  >
                    <ReRecord />
                  </div>
                  <div className="customercards-wrapper-section-snippet">
                    {item.customer}
                  </div>
                </div>
                <div className="customercards-wrapper-section-timestamp">
                  Message sent on {item.time}
                </div>
                <div className="customercards-wrapper-section-audio">
                  {" "}
                  <audio src={item.url} controls="controls" />
                </div>
              </React.Fragment>
            );
          })}
        </div>
        <div className="customercards-wrapper-input">
          {RecordReady === false ? (
            <>
              <div className="customercards-wrapper-input-text">
                <input
                  type="text"
                  placeholder="Type to create snippets"
                  onChange={e => {
                    setCurrMsg(e.target.value);
                    setErro(false);
                  }}
                />
              </div>
              <div
                className="customercards-wrapper-input-send"
                onClick={handleClick}
                onKeyPress={handleClick}
              >
                <div className="customercards-wrapper-input-send-icon">
                  <Send />
                </div>
              </div>
            </>
          ) : isRecording === false ? (
            <>
              <div
                className="customercards-wrapper-input-record"
                onClick={startRecord}
              >
                <div className="customercards-wrapper-input-record-icon">
                  {" "}
                  <RecorderBtn />
                </div>
                {Rerecord === true ? (
                  <div className="customercards-wrapper-input-record-info">
                    Tap to start RE Recording
                  </div>
                ) : (
                  <div className="customercards-wrapper-input-record-info">
                    Tap to start Recording
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Lottie options={defaultOptions} height={50} width={90} />
              <div
                className="customercards-wrapper-input-record"
                onClick={Rerecord ? stopRerecord : stopRecord}
              >
                <div className="customercards-wrapper-input-record-icon">
                  {" "}
                  <RecorderBtn />
                </div>
                <div className="customercards-wrapper-input-record-info">
                  Tap to stop recording
                </div>
              </div>
            </>
          )}
        </div>

        {error && (
          <div style={{ textAlign: "center", color: "white" }}>
            Please type something
          </div>
        )}
      </section>
    </>
  );
};

export default CustomerCards;
