import { useMutation, useQuery } from '@tanstack/react-query'
import axios from 'axios'
import React, { createContext } from 'react'
export const UserDataContext =createContext()
export default function UserDataContextProvider({children}) {


function getUserData(){
    return axios.get('https://route-posts.routemisr.com/users/profile-data',{headers:{
    token:localStorage.getItem('token')
}})
}

const {data, error , isLoading }=useQuery({
    queryFn: getUserData,
    queryKey: ["userData"],
    enabled:!!localStorage.getItem('token')
})
console.log('user data',data?.data?.data?.user);
console.log('error' ,error);
 
const userData= data?.data?.data?.user


    
  return (
    <UserDataContext.Provider value={{userData,isLoading}}>
      {children}
    </UserDataContext.Provider>
  )
}
