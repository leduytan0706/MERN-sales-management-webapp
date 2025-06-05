import React, { useState } from 'react'
import {Link} from 'react-router-dom'
import './LoginForm.css'

import { checkLoginData } from '../../utils/checkFormData';
import useAuthStore from '../../store/useAuthStore';
import { AtSign, KeyRound } from 'lucide-react';
import { CircularProgress } from '@mui/material';
import toast from 'react-hot-toast';

const LoginForm = () => {
    const {isLoggingIn, logIn} = useAuthStore();
    const [formData, setFormData] = useState({
        authInfo: '',
        password: '',
    });

    const handleLogin = async (e) => {
        e.preventDefault();
    
        const err = checkLoginData(formData);
        if (err){
          toast.error(err);
          return;
        }
    
        await logIn(formData);
    
    };

    return (
    <div className='login-form'>
        <form action="" method='POST' >
          <div className="form-field">
            <label htmlFor="authInfo" className='login-label'>Email hoặc Username</label>
            <div className='form-input'>
              <AtSign className='form-icon' />
              <input 
                type="text" 
                id='authInfo' 
                name='authInfo' 
                placeholder='johndoe@example.com' 
                className='input-field'
                values={formData.authInfo}
                onChange={(e) => setFormData((prev) => ({...prev, authInfo: e.target.value}))}
              />
            </div>
            
          </div>
          <div className="form-field">
            <label htmlFor="password" className='login-label'>Mật khẩu</label>
            <div className="form-input">
              <KeyRound  className='form-icon'/>
              <input 
                type="password" 
                id='password' 
                name='password' 
                placeholder='••••••••' 
                className='input-field'
                values={formData.password}
                onChange={(e) => setFormData((prev) => ({...prev, password: e.target.value}))}
              />
            </div>
            
          </div>
          <div className="form-submit">
            <button 
              type="submit"
              className="login-button"
              onClick={handleLogin} 
              disabled={isLoggingIn} 
            >
              {isLoggingIn? (
                <CircularProgress size={'15px'}/>
              ) : (
                  "Sign in"
              )}
            </button>
          </div>
        </form>
    </div>
    )
}

export default LoginForm