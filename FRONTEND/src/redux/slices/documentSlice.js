import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  docs: [],
  currentDoc: null,
  versions: [],
  loading: false,
  error: null,
};

const documentSlice = createSlice({
  name: "docs",
  initialState,
  reducers: {
    docStart: (state) => {
      state.loading = true;
      state.error = null;
    },

    setDocs: (state, action) => {
      state.loading = false;
      state.docs = action.payload;
    },

    setCurrentDoc: (state, action) => {
      state.loading = false;
      state.currentDoc = {
        ...action.payload,
        role: action.payload.role || "editor", 
      };
    },

    updateDoc: (state, action) => {
      if (state.currentDoc) {
        state.currentDoc.content = action.payload;
      }
    },

    setVersions: (state, action) => {
      state.loading = false;
      state.versions = action.payload;
    },

    docFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    clearDoc: (state) => {
      state.currentDoc = null;
      state.versions = [];
    },
  },
});

export const {
  docStart,
  setDocs,
  setCurrentDoc,
  updateDoc,
  setVersions,
  docFail,
  clearDoc,
} = documentSlice.actions;

export default documentSlice.reducer;