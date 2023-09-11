import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useAxios from '../hooks/useAxios';

const UserContext = createContext();
const PUBLIC_PATH = ['/login', '/sign-up']

export const useUserContext = () => {
  return useContext(UserContext);
};

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { getData } = useAxios();
  const location = useLocation();
  const navigate = useNavigate();
  const isPublicPath = useMemo(() => {
    return PUBLIC_PATH.includes(location.pathname)
  }, [location])

  useEffect(() => {   
    checkAuthorization();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkAuthorization = async () => {
    setIsLoading(true);
    try {
      const response = await getData('/users/me');
      const userDetails = response.data

      setUser(userDetails);
    } catch (error) {
      console.error('Error checking authorization:', error);
      if (error?.response?.status === 401 && !isPublicPath) navigate('/login')
    }
    setIsLoading(false);
  };

  return (
    <UserContext.Provider value={{ user, setUser, isLoading }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
