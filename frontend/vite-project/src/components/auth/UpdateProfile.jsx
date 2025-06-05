import React, { useEffect, useState } from 'react'
import {useNavigate, useParams} from 'react-router-dom';
import "./UpdateProfile.css"
import useAuthStore from '../../store/useAuthStore';
import { formatDateForDetail } from '../../utils/formatTime';
import { Camera, Save } from 'lucide-react';
import AddUpdateHeader from '../AddUpdateHeader';
import { Backdrop, CircularProgress } from '@mui/material';
import stringifyUserRoles from '../../utils/stringifyUserRoles';
import userRoles from '../../utils/userRoles';

const UpdateProfile = () => {
  const {authUser, updateProfile, isProcessing} = useAuthStore();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: authUser?.username,
    phoneNumber: authUser?.phoneNumber,
    avatar: authUser?.avatar
  });

  // useEffect(() => {
  //   if (authUser){
  //     setFormData({
  //       phoneNumber: authUser?.phoneNumber || "",
  //       avatar: authUser?.avatar || ""
  //     });
  //   }
  // }, [authUser]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    // create a file reader
    const reader = new FileReader();

    // read file into image url
    reader.readAsDataURL(file);

    reader.onload = async () => {
      // get the result from the file reader
      const base64Image = reader.result;

      // update form data with the new image
      setFormData({...formData, avatar: base64Image });

    };
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    await updateProfile(formData);
    navigate("/profile");
  };

  return (
    <div className='update-profile'>
      <div className="update-profile-header">
        <AddUpdateHeader 
          onReturn="/profile"
          headerTitle="Cập nhật thông tin tài khoản"
        />
      </div>
      <div className="update-profile-content">
        <div className="profile-save-btn">
          <button 
            type='button'
            className='save-btn'
            onClick={handleSubmit}
          >
            <span>Lưu</span>
            <Save className='save-icon'/>
          </button>
        </div>
        <div className="update-avatar">
            <div className="avatar-preview">
              <img src={formData?.avatar || "/avatar.png" } alt="" />
            </div>
            <label htmlFor="avatar" className="avatar-label">
              <input
                type="file"
                id="avatar"
                name="avatar"
                accept="image/png, image/jpeg"
                onChange={handleAvatarChange}
                style={{display: "none"}}
              />
              <Camera className='avatar-change-icon'/>
            </label>
            
        </div>
        <div className='update-info'>
            <div className="info-card">
              <h3>Email</h3>
              <h4>{authUser.email}</h4>
            </div>
            <div className="info-card">
              <h3>Tên người dùng</h3>
              <input 
                type="text"
                name="username" 
                id="username" 
                value={formData?.username}
                onChange={(e) => setFormData((prev) => ({...prev, username: e.target.value}))} 
              />
            </div>
            <div className="info-card">
              <h3>Số điện thoại</h3>
              <input 
                type="text"
                name="phoneNumber" 
                id="phoneNumber" 
                value={formData?.phoneNumber}
                onChange={(e) => setFormData((prev) => ({...prev, phoneNumber: e.target.value}))} 
              />
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
      <Backdrop
        sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
        open={isProcessing}
      >
        <CircularProgress size={64} />
      </Backdrop>
    </div>
  )
}

export default UpdateProfile