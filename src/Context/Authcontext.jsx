
 /* eslint-disable */


import React, { createContext, useEffect, useState } from "react";
import {jwtDecode} from 'jwt-decode'
export const Authcontext = createContext();

export default function AuthcontextProvider({ children }) {
  const [userId , setUserId]=useState(null);
  const [UserToken, setUserToken] = useState(function(){
    return localStorage.getItem('token');
  });
  console.log("UserToken", UserToken);


function clearusertoken(){
  setUserToken(null);
  localStorage.removeItem('token')
}

  function setTokenUser(tkn) {
    setUserToken(tkn);
  }

  function decodeUserToken(){
    const decodedToken = jwtDecode(UserToken);
    console.log('decodedToken' ,decodedToken.user);
    setUserId(decodedToken.user)
    }

    useEffect(() => {
      if (UserToken) {
        decodeUserToken();
      }
    }, [UserToken]);

  return (
    <Authcontext.Provider value={{ UserToken, setTokenUser ,clearusertoken , userId }}>
      {children}
    </Authcontext.Provider>
  );
}
