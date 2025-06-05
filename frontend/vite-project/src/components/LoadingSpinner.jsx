import { CircularProgress } from '@mui/material'
import React from 'react'

const LoadingSpinner = ({size = 64}) => {
  return (
    <div className='align-center loading-spinner' style={loadingStyle}>
        <CircularProgress 
            size={size} 
            color="primary"
        />
    </div>
  )
}

const loadingStyle = {
    width: '100%',
    height: '100%',
    zIndex: 1000,
};

export default LoadingSpinner