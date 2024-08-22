import React, { useContext } from 'react'
import { AuthContextKai } from '../context/AuthContext'
import { Navigate, Outlet } from 'react-router-dom'

const PrivateRouter = () => {

  const{currentUser} = useContext(AuthContextKai)

  return currentUser ? <Outlet/> : <Navigate to="/login"/>
}

export default PrivateRouter