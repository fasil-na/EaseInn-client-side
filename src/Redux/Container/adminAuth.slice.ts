import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AdminAuthState {
  adminToken: string;
  adminRole: string;
}

interface AdminLoginPayload {
  adminToken: string;
  adminRole: string;
}

const INITIAL_STATE: AdminAuthState = {
  adminToken: '',
  adminRole: '',
}

const adminAuthSlice = createSlice({
  name: 'auth',
  initialState: INITIAL_STATE,
  reducers: {
    setAdminLogin(state, action: PayloadAction<AdminLoginPayload>) {
      state.adminToken = action.payload.adminToken;
      state.adminRole = action.payload.adminRole;
      localStorage.setItem('adminToken', action.payload.adminToken);
      localStorage.setItem('adminRole', action.payload.adminRole);
    },
    setAdminLogout(state) {
      state.adminToken = '';
      state.adminRole = '';
      localStorage.clear();
    },
  }
});

export const adminAuthAction = adminAuthSlice.actions;

export default adminAuthSlice.reducer;

export type { AdminAuthState, AdminLoginPayload };
