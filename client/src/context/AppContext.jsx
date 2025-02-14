import axios from 'axios';
import { createContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const backend_url = import.meta.env.VITE_BACKEND_URL;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(false);

  const getAuthState = async () => {
    try {
      const { data } = await axios.get(backend_url + '/api/v1/is-authenticated',
        { withCredentials: true });
      if (data.success) {
        setIsLoggedIn(true)
        getUserData();
      }
    } catch (error) {
      toast.error(error.response.data.message || error)
    }
  }
  const getUserData = async () => {
    try {
      const { data } = await axios.get(backend_url + '/api/v1/user/data',
        { withCredentials: true });
      { data.success ? setUserData(data.userDetail) : toast.error(data.message) }
    } catch (error) {
      toast.error(error.response.data.message || error)
    }
  }
  useEffect(() => {
    getAuthState();
  }, [])
  const value = {
    backend_url, isLoggedIn, setIsLoggedIn, userData, setUserData,
    getUserData
  }
  return (
    <AppContext.Provider value={value} >
      {props.children}
    </AppContext.Provider>
  )
}