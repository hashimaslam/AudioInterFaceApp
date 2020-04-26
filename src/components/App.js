import React, { useContext, useState, useEffect } from "react";
import CustomerCards from "./MainCards/CustomerCard";
import MainCards from "./MainCards/MainCards";
import { GlobalContext } from "../context/GlobalState";
function App() {
  const maincontext = useContext(GlobalContext);
  const [isBlocked, SetBlocked] = useState(false);
  const handleBuffer = () => {
    console.log(maincontext);
    maincontext.CreateBlob();
    maincontext.GetAudio();
  };
  //
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

  return (
    <React.Fragment>
      {isBlocked && (
        <h1 style={{ color: "white", textAlign: "center" }}>
          Sorry Your Without Providing Mic access you can't access this
          Application ,Please Provide Access and Reload the App again
        </h1>
      )}
      {!isBlocked && (
        <>
          <h1 className="primary-heading">Sample Interface</h1>
          <main role="main" className="convo-container">
            <MainCards />
            <CustomerCards />
          </main>
          <div className="generate-audio">
            <button onClick={handleBuffer}>Generate Audio</button>
            {maincontext.Generated && (
              <>
                <audio src={maincontext.finalblob} controls="controls" />
                <button
                  onClick={() =>
                    maincontext.Download(maincontext.GlobalSnippets)
                  }
                >
                  Download Transcript
                </button>
              </>
            )}
          </div>
        </>
      )}
    </React.Fragment>
  );
}

export default App;
