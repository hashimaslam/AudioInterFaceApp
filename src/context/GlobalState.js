import React, { createContext, useReducer } from "react";
import AppReducer from "./AppReducer";

// Initial state
const initialState = {
  GlobalSnippets: [],
  GlobalBuffer: [],
  FinalBlob: "",
  Generated: false
};

// Create context
export const GlobalContext = createContext(initialState);

// Provider component
export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AppReducer, initialState);
  //Add sinnppets to global state
  async function addSnippets(snipps) {
    try {
      dispatch({ type: "ADD_SNIPPET", payload: snipps });
    } catch (error) {
      console.log(error);
    }
  }
  //Detelet from global state
  async function deleteSnippets(i) {
    try {
      let newSnipps = state.GlobalSnippets.filter(item => {
        return item.id !== i;
      });
      let newBuffers = state.GlobalBuffer.filter(item => {
        return item.id !== i;
      });
      dispatch({
        type: "DELETE_SNIPPETS",
        payload: { snippets: newSnipps, buffer: newBuffers }
      });
    } catch (error) {
      console.log(error);
    }
  }

  //Setting RErecorded audio to Global Snippets and buffer
  async function setRecord(i, url, buffer) {
    try {
      let newSnipps = state.GlobalBuffer.map(item => {
        if (item.id === i) {
          item.url = url;
        }
        return item;
      });
      let newbuffer = state.GlobalBuffer.map(item => {
        if (item.id === i) {
          item.buffer = buffer;
        }
        return item;
      });
      dispatch({
        type: "RERECORD",
        payload: {
          snippets: newSnipps,
          buffer: newbuffer
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  //adding new buffer to the Global buffer
  async function addBuffer(data) {
    try {
      dispatch({ type: "ADD_BUFFER", payload: data });
    } catch (error) {
      console.log(error);
    }
  }

  //merging buffers to create a full length stiched audio file
  async function CreateBlob() {
    try {
      let temp1 = state.GlobalBuffer.map((item, index) => {
        return item.buffer;
      });
      console.log(temp1);
      let temp2 = temp1.flat();
      let newBlob = new Blob(temp2, { type: "audio/mp3" });
      const nblobURL = URL.createObjectURL(newBlob);
      dispatch({ type: "FINAL_BLOB", payload: nblobURL });
    } catch (error) {
      console.log(error);
    }
  }

  //Download Transcript
  const Download = jsonData => {
    const fileData = JSON.stringify(jsonData, null, 2);
    const blob = new Blob([fileData], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = "transcript.json";
    link.href = url;
    link.click();
  };

  //getting the final audio file
  async function GetAudio() {
    try {
      dispatch({ type: "GET_AUDIO", payload: true });
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <GlobalContext.Provider
      value={{
        GlobalSnippets: state.GlobalSnippets,
        GlobalBuffer: state.GlobalBuffer,
        addSnippets,
        addBuffer,
        CreateBlob,
        GetAudio,
        Generated: state.Generated,
        finalblob: state.FinalBlob,
        deleteSnippets,
        setRecord,
        Download
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
