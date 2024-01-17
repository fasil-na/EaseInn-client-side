import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface GuestAuthState {
  guestToken: string;
  guestRole: string;
}

interface GuestLoginPayload {
  guestToken: string;
  guestRole: string;
}

const INITIAL_STATE: GuestAuthState = {
  guestToken: '',
  guestRole: '',
}

const guestAuthSlice = createSlice({
  name: 'auth',
  initialState: INITIAL_STATE,
  reducers: {
    setGuestLogin(state, action: PayloadAction<GuestLoginPayload>) {
      state.guestToken = action.payload.guestToken;
      state.guestRole = action.payload.guestRole;
      localStorage.setItem('guestToken', action.payload.guestToken);
      localStorage.setItem('guestRole', action.payload.guestRole);
    },
    setGuestLogout(state) {
      state.guestToken = '';
      state.guestRole = '';
      localStorage.clear();
    },
  }
});

export const guestAuthAction = guestAuthSlice.actions;

export default guestAuthSlice.reducer;

export type { GuestAuthState, GuestLoginPayload };
