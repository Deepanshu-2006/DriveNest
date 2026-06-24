"use client";
import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useUser } from '@clerk/nextjs';

export default function ToastProvider() {
  const { isSignedIn } = useUser();
  const isDark = isSignedIn;

  return (
    <ToastContainer 
      position="bottom-right" 
      autoClose={3000} 
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme={isDark ? 'dark' : 'light'}
    />
  );
}
