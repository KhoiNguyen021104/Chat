import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  modals: {
    gif: false,
    // audio: false,
    media: false,
    doc: false
  },
  selectedGifUrl: ''
}

const slice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    updateGifModal(state, action) {
      state.modals.gif = action.payload.value
      state.selectedGifUrl = action.payload.url
    },
    // updateAudioModal(state, action) {
    //   state.modals.audio = action.payload;
    // },
    updateMediaModal(state, action) {
      state.modals.media = action.payload
    },
    updateDocumentModal(state, action) {
      state.modals.doc = action.payload
    }
  }
})

export default slice.reducer

export const ToogleGifModal = (value) => async (dispatch) => {
  dispatch(slice.actions.updateGifModal(value))
}
export const ToogleMediaModal = (value) => async (dispatch) => {
  dispatch(slice.actions.updateMediaModal(value))
}
export const ToogleDocumentModal = (value) => async (dispatch) => {
  dispatch(slice.actions.updateDocumentModal(value))
}
