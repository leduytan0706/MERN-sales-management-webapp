import React, { useEffect, useState } from 'react'
import "./AccountCard.css"
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Backdrop } from '@mui/material';

const AccountCard = ({email, username, password}) => {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate("/user"); // Điều hướng về trang user
        }, 3 * 60 * 1000);
      
        return () => clearTimeout(timer); // Dọn dẹp để ngăn rò rỉ memory
    }, [navigate]);

  return (
    <Backdrop
        sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
        open={true}
    >
        <div className='account-snippet'>
            <div className='card-title'>
                <h3>Tài khoản người dùng mới</h3>
            </div>
            <div className='card-content'>
                <div className='card-warn'>
                    <p className='card-warn-text'>Hệ thống sẽ quay lại trang Người dùng trong 2 phút.</p>
                    <p className='card-warn-text'>Hãy lưu lại thông tin đăng nhập này.</p>
                </div>
                <div className='account-info'>
                    <div className='info-card'>
                        <h3>Email:{" "}</h3>
                        <h4>{email}</h4>
                    </div>
                    {username && (
                    <div className='info-card'>
                        <h3>Tên đăng nhập:{" "}</h3>
                        <h4>{username}</h4>
                    </div>
                    )}
                    <div className='info-card'>
                        <h3>Mật khẩu:{" "}</h3>
                        <h4>{showPassword? password: "•".repeat(password.length)}</h4>
                        <button
                            className='password-toggle'
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {!showPassword? <EyeOff className='toggle-icon'/>: <Eye className='toggle-icon'/>}
                        </button>
                    </div>
                </div>
                <div className='card-action'>
                    <button 
                        className='return-btn'
                        onClick={() => {
                            navigate("/user");
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

export default AccountCard