import React from 'react'
import "./ProfileDetail.css"
import useAuthStore from '../../store/useAuthStore';
import { formatDateForDetail } from '../../utils/formatTime';
import { SquarePen } from 'lucide-react';
import AddUpdateHeader from '../AddUpdateHeader';
import { NavLink } from 'react-router-dom';
import stringifyUserRoles from '../../utils/stringifyUserRoles';

const ProfileDetail = () => {
  const {authUser} = useAuthStore();

  return (
    <div className='profile-detail'>
      <div className="profile-detail-header">
        <AddUpdateHeader 
          onReturn="/"
          headerTitle="Thông tin cá nhân"
        />
      </div>
      <div className='profile-detail-content'>
        <div className="profile-edit-btn">
          <NavLink 
            className='edit-link'
            to="/profile/update"
          >
            <span>Sửa</span>
            <SquarePen className='edit-icon'/>
          </NavLink>
        </div>
        <div className="profile-avatar">
          <div className='profile-avatar-section'>
            <img src={authUser.avatar || "/avatar.png" } alt="" />
          </div>

        </div>
        <div className='profile-info'>
            <div className="info-card">
              <h3>Email</h3>
              <h4>{authUser.email}</h4>
            </div>
            <div className="info-card">
              <h3>Tên người dùng</h3>
              <h4>{authUser.username}</h4>
            </div>
            <div className="info-card">
              <h3>Số điện thoại</h3>
              <h4>{authUser.phoneNumber}</h4>
            </div>
            <div className="info-card">
              <h3>Vai trò</h3>
              <h4>{stringifyUserRoles(authUser.roles)}</h4>
            </div>
            <div className="info-card create-date">
              <h3>Ngày tạo</h3>
              <h4>{formatDateForDetail(authUser.createdAt)}</h4>
            </div>
        </div>
      </div>
      
    </div>
  )
}

export default ProfileDetail