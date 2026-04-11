import React, { Children } from 'react'
import { Navigate } from 'react-router-dom'

export default function ProtectedRegisterRoute({children}) {
    if(localStorage.getItem("token")!==null){
   return <Navigate to="/home"/>
    }
  return (
    <>
      {children}
    </>
  )
}
