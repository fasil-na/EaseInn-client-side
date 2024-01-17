import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface HostAuthState {
  hostToken: string;
  hostRole: string;
}

interface HostLoginPayload {
  hostToken: string;
  hostRole: string;
}

const INITIAL_STATE: HostAuthState = {
  hostToken: '',
  hostRole: '',
}

const hostAuthSlice = createSlice({
  name: 'auth',
  initialState: INITIAL_STATE,
  reducers: {
    setHostLogin(state, action: PayloadAction<HostLoginPayload>) {
      state.hostToken = action.payload.hostToken;
      state.hostRole = action.payload.hostRole;
      localStorage.setItem('hostToken', action.payload.hostToken);
      localStorage.setItem('hostRole', action.payload.hostRole);
    },
    setHostLogout(state) {
      state.hostToken = '';
      state.hostRole = '';
      localStorage.clear();
    },
  }
});

export const hostAuthAction = hostAuthSlice.actions;

export default hostAuthSlice.reducer;

export type { HostAuthState, HostLoginPayload };
