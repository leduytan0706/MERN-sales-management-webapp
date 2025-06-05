import React from 'react'
import './LoginPage.css'

import LoginForm from '../components/auth/LoginForm'

const LoginPage = () => {
    return (
        <div className='login-bg'>
            <div className='login-page'>
                <div className='login-section'>
                    <div className="login-title">
                        <p>Đăng nhập</p>
                        <div className='divider'></div>
                    </div>
                    <LoginForm />
                </div>
                <div className="login-intro">
                    <img src="signup-intro.jpg" alt="" />
                </div>
            </div>
        </div>
      )
}

export default LoginPage