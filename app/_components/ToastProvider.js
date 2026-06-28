"use client";
import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ToastProvider() {
  return (
    <ToastContainer 
      position="bottom-right" 
      autoClose={3600} 
      hideProgressBar
      newestOnTop
      closeOnClick
      pauseOnFocusLoss
      draggable
      pauseOnHover
      closeButton={false}
      icon={false}
      stacked
      limit={4}
      toastClassName={() => 'drivenest-toast-shell'}
      bodyClassName={() => 'drivenest-toast-body'}
    />
  );
}
