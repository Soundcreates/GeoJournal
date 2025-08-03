import React from 'react'
import { useNavigate } from 'react-router';

function Logout() {
  const navigate = useNavigate();


  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate('/');

  }
  return (
    <div className="cursor-pointer p-1  bg-red-500 text-center text-white rounded-md " onClick={handleLogout}>
      Logout
    </div>
  )
}

export default Logout