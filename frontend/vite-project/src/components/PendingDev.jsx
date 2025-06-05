import React from 'react'
import "./PendingDev.css";
import { Backdrop } from '@mui/material'
import { useNavigate } from 'react-router-dom';

const PendingDev = () => {
    const navigate = useNavigate();

  return (
    <Backdrop
        sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
        open={true}
    >
        <div className='pending-dev'>
            <div className='card-title'>
                <h3>Đang phát triển</h3>
            </div>
            <div className='card-content'>
                <h2>Chức năng này hiện đang trong quá trình phát triển.</h2>
                <div className='card-action'>
                    <button 
                        className='return-btn'
                        onClick={() => {
                            navigate(-1);
                        }}
                    >
                        Quay lại
                    </button>
                </div>
            </div>
        </div>
    </Backdrop>
  )
}

export default PendingDev