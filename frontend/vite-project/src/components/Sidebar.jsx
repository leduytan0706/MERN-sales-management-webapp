import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'


import {Box, Boxes, ChartColumn, ChevronRight, LayoutDashboard, List, LogOut, Settings, ShoppingBag, SquarePercent, Store, Truck, UserPen, Users} from 'lucide-react' 
import "./Sidebar.css"
import useAuthStore from '../store/useAuthStore'


const Sidebar = () => {

  const {authUser, logOut} = useAuthStore();

  return (
    <div className='sidebar-container'>
      <div className='sidebar-desktop'>
        <NavLink 
          to="/"
          className='title'
        >
          <Boxes color='#0051c4' className='logo' />
          <span className='company-name'>InvenStory</span>
        </NavLink>
        <div className='menu'>
          <div className='space-holder1'></div>
          <div className='navbar'>
            <NavLink
              to="/"
              className={({ isActive }) => (isActive? "nav-link nav-active" : "nav-link")}
            >
              <LayoutDashboard className='nav-icon'/>
              <span className='nav-title'>Tổng quan</span>
            </NavLink>
            <NavLink
              to="/product"
              className={({ isActive }) => (isActive? "nav-link nav-active" : "nav-link")}
            >
              <Store className='nav-icon' />
              <span className='nav-title'>Sản phẩm</span>
            </NavLink>
            <NavLink
              to="/import"
              className={({ isActive }) => (isActive? "nav-link nav-active" : "nav-link")}
            >
              <Box className='nav-icon' />
              <span className='nav-title'>Nhập hàng</span>
            </NavLink>
            <NavLink
              to="/order"
              className={({ isActive }) => (isActive? "nav-link nav-active" : "nav-link")}
            >
              <ShoppingBag className='nav-icon' />
              <span className='nav-title'>Đơn hàng</span>
            </NavLink>
            <NavLink
              to="/supplier"
              className={({ isActive }) => (isActive? "nav-link nav-active" : "nav-link")}
            >
              <Truck className='nav-icon' />
              <span className='nav-title'>Cung cấp</span>
            </NavLink>
            <NavLink
              to="/category"
              className={({ isActive }) => (isActive? "nav-link nav-active" : "nav-link")}
            >
              <List className='nav-icon' />
              <span className='nav-title'>Danh mục</span>
            </NavLink>
            <NavLink
              to="/discount"
              className={({ isActive }) => (isActive? "nav-link nav-active" : "nav-link")}
            >
              <SquarePercent className='nav-icon' />
              <span className='nav-title'>Khuyến mãi</span>
            </NavLink>
            <NavLink
              to="/report"
              className={({ isActive }) => (isActive? "nav-link nav-active" : "nav-link")}
            >
              <ChartColumn className='nav-icon' />
              <span className='nav-title'>Thống kê</span>
            </NavLink>
          </div>
          <div className='space-holder2'>
            <ul 
              className="account-link"
            >
              <li className="account-card" 
              >
                <img src={authUser.avatar || "/avatar.png"} alt="avatar placeholder" className="account-avatar" />
                <span className="account-name">{authUser.username}</span>
                <ChevronRight className='submenu-icon' />

                <ul 
                  className="submenu"
                >
                  <li>
                    <NavLink 
                      to="/profile"
                      className="sub-link"
                    >        
                      <UserPen className='sub-icon' />
                      <span className='sub-title'>Hồ sơ</span>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink 
                      to="/settings"
                      className="sub-link"
                    >
                      <Settings className='sub-icon'/>
                      <span className='sub-title'>Cài đặt</span>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink 
                      to="/user"
                      className="sub-link"
                    >
                      <Users className='sub-icon'/>
                      <span className='sub-title'>Người dùng</span>
                    </NavLink>
                  </li>
                  <li>
                    <button 
                      className='sub-link logout-button'
                      onClick={logOut}
                    >
                      <LogOut className='sub-icon' />
                      <span className='sub-title'>Đăng xuất</span>
                    </button>
                  </li>
                  
                </ul>
              </li>

              
            </ul>
            
          </div>
      
        </div>

      </div>
      <div className="sidebar-mobile">
        <NavLink 
          to="/"
          className='title align-center'
        >
          <Boxes color='#0051c4' className='logo' />
        </NavLink>
        <div className='menu'>
          <div className='space-holder1'></div>
          <div className='navbar'>
            <NavLink
              to="/"
              className={({ isActive }) => (isActive? "nav-link nav-active" : "nav-link")}
            >
              <LayoutDashboard className='nav-icon'/>
            </NavLink>
            <NavLink
              to="/product"
              className={({ isActive }) => (isActive? "nav-link nav-active" : "nav-link")}
            >
              <Store className='nav-icon' />
            </NavLink>
            <NavLink
              to="/import"
              className={({ isActive }) => (isActive? "nav-link nav-active" : "nav-link")}
            >
              <Box className='nav-icon' />
            </NavLink>
            <NavLink
              to="/order"
              className={({ isActive }) => (isActive? "nav-link nav-active" : "nav-link")}
            >
              <ShoppingBag className='nav-icon' />
            </NavLink>
            <NavLink
              to="/supplier"
              className={({ isActive }) => (isActive? "nav-link nav-active" : "nav-link")}
            >
              <Truck className='nav-icon' />
            </NavLink>
            <NavLink
              to="/category"
              className={({ isActive }) => (isActive? "nav-link nav-active" : "nav-link")}
            >
              <List className='nav-icon' />
            </NavLink>
            <NavLink
              to="/discount"
              className={({ isActive }) => (isActive? "nav-link nav-active" : "nav-link")}
            >
              <SquarePercent className='nav-icon' />
            </NavLink>
            <NavLink
              to="/report"
              className={({ isActive }) => (isActive? "nav-link nav-active" : "nav-link")}
            >
              <ChartColumn className='nav-icon' />
            </NavLink>
          </div>
          <div className='space-holder2'>
            <ul 
              className="account-link"
            >
              <li className="account-card" 
              >
                <img src={authUser.avatar || "/avatar.png"} alt="avatar placeholder" className="account-avatar" />
                <ul 
                  className="submenu"
                >
                  <li>
                    <NavLink 
                      to="/profile"
                      className="sub-link"
                    >        
                      <UserPen className='sub-icon' />
                    </NavLink>
                  </li>
                  <li>
                    <NavLink 
                      to="/settings"
                      className="sub-link"
                    >
                      <Settings className='sub-icon'/>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink 
                      to="/user"
                      className="sub-link"
                    >
                      <Users className='sub-icon'/>
                    </NavLink>
                  </li>
                  <li>
                    <button 
                      className='sub-link logout-button'
                      onClick={logOut}
                    >
                      <LogOut className='sub-icon' />
                    </button>
                  </li>
                  
                </ul>
              </li>

              
            </ul>
            
          </div>
      
        </div>
      </div>
      

    </div>
  )
}

export default Sidebar