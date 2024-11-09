import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoginModal: false,
  isSignupModal: false,
};

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    OnLoginModal: (state) => {
      state.isLoginModal = true;
    },
    OffLoginModal: (state) => {
      state.isLoginModal = false;
    },
    OnSignupModal: (state) => {
      state.isSignupModal = true;
    },
    OffSignupModal: (state) => {
      state.isSignupModal = false;
    },
  },
});

export const { OnLoginModal, OffLoginModal, OnSignupModal, OffSignupModal } =
  modalSlice.actions;
export default modalSlice.reducer;
