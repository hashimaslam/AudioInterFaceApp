export default (state, action) => {
  switch (action.type) {
    case "ADD_SNIPPET":
      return {
        ...state,
        GlobalSnippets: [...state.GlobalSnippets, action.payload]
      };
    case "ADD_BUFFER":
      return {
        ...state,
        GlobalBuffer: [
          ...state.GlobalBuffer,
          { id: action.payload.id, buffer: action.payload.buffer }
        ]
      };
    case "DELETE_SNIPPETS":
      return {
        ...state,
        GlobalSnippets: action.payload.snippets,
        GlobalBuffer: action.payload.buffer
      };
    case "RERECORD":
      return {
        ...state,
        GlobalSnippets: action.payload.snippets,
        GlobalBuffer: action.payload.buffer
      };
    case "FINAL_BLOB":
      return {
        ...state,
        FinalBlob: action.payload
      };
    case "GET_AUDIO":
      return {
        ...state,
        Generated: action.payload
      };
    default:
      return state;
  }
};
