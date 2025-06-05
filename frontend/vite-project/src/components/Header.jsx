import { Bell, MessageSquareMore } from 'lucide-react'
import React, { useState } from 'react'
import './Header.css'
import useAuthStore from '../store/useAuthStore'

const Header = () => {
    const {authUser} = useAuthStore();

    return (
        <div className='header'>
            <div className='header-title'>
                Chào mừng, {authUser.username}!
            </div>
            <div></div>
            <div className='header-info'>
                <span className='datetime'>{new Date().toLocaleDateString('vi-VN')}</span>
                <MessageSquareMore className='header-icon' />
                <Bell className='header-icon' />
            </div>
        </div>
    )
}

export default Header