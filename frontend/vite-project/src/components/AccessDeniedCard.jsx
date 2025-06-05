import React from 'react'
import "./AccessDeniedCard.css";
import { useNavigate } from 'react-router-dom';

const AccessDeniedCard = ({text}) => {
    const navigate = useNavigate();

  return (
    <div className='access-denied-card'>
        <div className='card-title'>
            <h3>Từ chối truy cập</h3>
        </div>
        <div className='card-content'>
            <h2>Bạn không có quyền thực hiện chức năng này.</h2>
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
  )
}

export default AccessDeniedCard