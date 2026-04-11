import React from 'react'
import { ClipLoader } from 'react-spinners'

export default function Loaderpage() {
  return (
    <div  className=' min-h-screen flex  justify-center items-center '>
      <ClipLoader color="#046d6a" size={100} />
    </div>
  )
}
