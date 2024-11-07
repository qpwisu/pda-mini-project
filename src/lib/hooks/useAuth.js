import React, { useContext } from 'react';
import { AuthContext } from '~/components/contexts/authContext';

export default function useAuth() {
  return useContext(AuthContext);
}
