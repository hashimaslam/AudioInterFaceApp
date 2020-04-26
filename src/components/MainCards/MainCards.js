import React, { useState, useEffect, useContext } from "react";
import { ReactComponent as Send } from "../../assets/send.svg";
import MicRecorder from "mic-recorder-to-mp3";
import { ReactComponent as RecorderBtn } from "../../assets/radio.svg";
import { ReactComponent as ReRecord } from "../../assets/microphone.svg";
import { ReactComponent as Delete } from "../../assets/trash.svg";
import uuid from "react-uuid";
import Lottie from "react-lottie";

import * as recorderData from "../../assets/recorderwave.json";
import { GlobalContext } from "../../context/GlobalState";
const Mp3Recorder = new MicRecorder({ bitRate: 128 });

const MainCards = () => {
  const [RecordReady, setRecordReady] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [sinppets, Addsnippets] = useState([]);
  const [currMsg, setCurrMsg] = useState("");
  const [error, setErro] = useState(false);
  const [Rerecord, setRerecord] = useState(false);
  const [ReId, setReId] = useState("");
  let d = new Date();

  //Global Context
  const maincontext = useContext(GlobalContext);

  //Add Sinppets
  const handleClick = () => {
    console.log("clickeds");
    if (currMsg === "") {
      return setErro(true);
    }
    Addsnippets(prev => [
      ...prev,
      { id: uuid(), Bot: currMsg, time: d.toUTCString(), url: "" }
    ]);
    setRecordReady(true);
    setCurrMsg("");
    setErro(false);
  };

  //Start Recording
  const startRecord = () => {
    Mp3Recorder.start()
      .then(() => {
        setIsRecording(true);
      })
      .catch(e => console.error(e));
  };
  //Stop Recording
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
  //Delete Recording
  const handleDelete = i => {
    let newSnipp = sinppets.filter(item => {
      return item.id !== i;
    });
    Addsnippets(newSnipp);
    maincontext.deleteSnippets(i);
  };

  //Staert RE record
  const handleRerecord = i => {
    setRecordReady(true);
    setRerecord(true);
    setReId(i);
  };
  //Stop RE record
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

  useEffect(() => {
    console.log(maincontext.GlobalSnippets);
  }, [maincontext.GlobalSnippets]);

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
      <section className="maincards-wrapper">
        <div className="maincards-wrapper-header">Bot</div>
        <div className="maincards-wrapper-section">
          {!sinppets.length && (
            <h1 style={{ textAlign: "center", color: "white" }}>
              No Snippets yet
            </h1>
          )}

          {sinppets.map((item, index) => {
            return (
              <div id={`simple-item-${item.id}`} key={item.id}>
                <div>
                  <div className="maincards-wrapper-section-snippet">
                    {item.Bot}
                  </div>
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
                </div>
                <div className="maincards-wrapper-section-timestamp">
                  Message sent on {item.time}
                </div>
                <div className="maincards-wrapper-section-audio">
                  {" "}
                  <audio src={item.url} controls="controls" />
                </div>
              </div>
            );
          })}
        </div>
        <div className="maincards-wrapper-input">
          {RecordReady === false ? (
            <>
              <div className="maincards-wrapper-input-text">
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
                className="maincards-wrapper-input-send"
                onClick={handleClick}
              >
                <div className="maincards-wrapper-input-send-icon">
                  <Send />
                </div>
              </div>
            </>
          ) : isRecording === false ? (
            <>
              <div
                className="maincards-wrapper-input-record"
                onClick={startRecord}
              >
                <div className="maincards-wrapper-input-record-icon">
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
                className="maincards-wrapper-input-record"
                onClick={Rerecord ? stopRerecord : stopRecord}
              >
                <div className="maincards-wrapper-input-record-icon">
                  {" "}
                  <RecorderBtn />
                </div>
                <div className="maincards-wrapper-input-record-info">
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

export default MainCards;
