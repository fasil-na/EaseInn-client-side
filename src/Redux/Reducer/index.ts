import { combineReducers } from 'redux';
import GuestAuthReducer, { GuestAuthState } from '../Container/guestAuth.slice';
import HostAuthReducer, { HostAuthState } from '../Container/hostAuth.slice';
import AdminAuthReducer, { AdminAuthState } from '../Container/adminAuth.slice';

interface RootState {
  GuestAuthState: GuestAuthState;
  HostAuthState: HostAuthState;
  AdminAuthState: AdminAuthState;
}

const rootReducer = combineReducers<RootState>({
  GuestAuthState: GuestAuthReducer,
  HostAuthState: HostAuthReducer,
  AdminAuthState: AdminAuthReducer
});

export default rootReducer;
export type { RootState };
