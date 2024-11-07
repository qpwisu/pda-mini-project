// authSlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// 보호된 API를 사용해 인증 상태 확인
export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  (_, { rejectWithValue }) => {
    return fetch('/api/users/api/v1/protected', {
      method: 'GET',
      credentials: 'include', // 쿠키 포함 요청
    })
      .then((response) => {
        if (!response.ok) {
          return Promise.reject('Network response was not ok'); // 응답이 실패하면 에러 처리
        }
        return response.json(); // JSON 응답을 반환
      })
      .then((data) => {
        return data.user; // 서버로부터 사용자 이메일 반환
      })
      .catch((error) => {
        return rejectWithValue(error); // 에러 발생 시 처리
      });
  }
);
// 로그인했을때 REDUX에 저장된 상태를 업그레이드 하기
// const { status, error, isLoggedIn, user } = useSelector(
//     (state) => state.auth
//   );
// 이런거이용해서 다시 해줘
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isLoggedIn: false,
    user: null,
    status: 'idle',
    error: null,
  },
  reducers: {
    logout(state) {
      state.isLoggedIn = false;
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoggedIn = true;
        state.user = action.payload;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.isLoggedIn = false;
        state.user = null;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
