// authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const userFromSession = sessionStorage.getItem('user')
  ? JSON.parse(sessionStorage.getItem('user'))
  : null;

const initialState = {
  isLoggedIn: !!userFromSession, // 로그인 상태를 true/false로 설정
  user: userFromSession, // user 데이터
  status: userFromSession ? 'success' : 'idle', // 상태를 'success'로 설정
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.isLoggedIn = true;
      state.user = action.payload; // 서버에서 받은 유저 정보를 저장
      state.status = 'success';
    },
    loginFailure: (state, action) => {
      state.isLoggedIn = false;
      state.user = null;
      state.status = 'failed';
      state.error = action.payload;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.user = null;
    },
    checkAuth: (state, action) => {
      state.isLoggedIn = true;
      state.user = action.payload; // 인증된 유저 정보로 상태 업데이트
      sessionStorage.removeItem('user'); // 로그아웃 시 sessionStorage에서 유저 정보 제거
    },
  },
});

export const { loginSuccess, loginFailure, logout, checkAuth } =
  authSlice.actions;

export default authSlice.reducer;
