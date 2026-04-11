import React from 'react'
import Navbar from '../Navbar/Navbar'
import Footer from '../Footer/Footer'
import { Outlet } from 'react-router-dom'

export default function Layout() {
  return (
    <>
      <Navbar/>
      
      <main className='min-h-screen bg-linear-to-t from-blue-500 p-5'>
        <Outlet/>
      </main>
      
      <Footer/>
    </>
  )
}
