import React, { useState } from 'react'
import "./AddUser.css"
import {AtSign} from "lucide-react";
import useAuthStore from "../../store/useAuthStore";
import AddUpdateHeader from "../AddUpdateHeader";
import userRoles from '../../utils/userRoles';
import { Backdrop } from '@mui/material';
import AccessDeniedCard from '../AccessDeniedCard';
import { checkUserFormData } from '../../utils/checkFormData';
import toast from 'react-hot-toast';
import AccountCard from './components/AccountCard';
import generatePassword from '../../utils/generatePassword';

const AddUser = () => {
  const {authUser, addUser} = useAuthStore();
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    phoneNumber: "",
    password: "",
    avatar: "",
    role: "employee",
    employeeRoles: []
  });
  const [isUserAdded, setIsUserAdded] = useState(false);

  const handleUploadAvatar = (e) => {
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
  };

  const handleGeneratePassword = (e) => {
    const randomPassword = generatePassword();
    setFormData(prev => ({...prev, password: randomPassword}));
  };

  const handleRoleChange = (e) => {
    const selectedRole = e.target.value;
    if (selectedRole === "manager" || selectedRole === "employee"){
      setFormData(prev => ({
        ...prev,
        role: selectedRole
      }));
    }
    else {
      const formRoles = [...formData.employeeRoles];
      setFormData(prev => ({
        ...prev,
        employeeRoles: e.target.checked? [...formRoles, selectedRole]: formRoles.filter(role => role !== selectedRole)
      }));
    }
    
  };

  // console.log(formData);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationResult = checkUserFormData(formData);
    if (validationResult){
      toast.error(validationResult);
      return;
    }
    const createdUser = await addUser(formData);
    if (!createdUser){
      return;
    }
  
    setIsUserAdded(true);
  };  


  return (
    <div className='add-user'>
      <AddUpdateHeader 
        onReturn="/user"
        headerTitle="Thêm mới người dùng"
      />
      <div className="add-user-section">
        <form className="add-user-form" action="" onSubmit={handleSubmit}>
          <div className='form-section-title align-center'>
            Thông tin tài khoản
          </div>
          <div className='form-field'>
            <label htmlFor="email" className='form-label'>
              <span>Email:</span>
              <div className='form-input' >
                <input 
                  type="email" 
                  id='email' 
                  name='email' 
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))}
                />
              </div>
              
            </label>
          </div>
          <div className='form-field'>
            <label htmlFor="username" className='form-label'>
              <span>Tên người dùng (Username):</span>
              <div className='form-input' >
                <input 
                  type="text" 
                  id='username' 
                  name='username' 
                  value={formData.username}
                  onChange={(e) => setFormData(prev => ({...prev, username: e.target.value}))}
                />
              </div>
              
            </label>
          </div>
          <div className='form-field'>
            <label htmlFor="phoneNumber" className='form-label'>
              <span>Số điện thoại:</span>
              <div className='form-input password-input' >
                <input 
                  type="text" 
                  id='phoneNumber' 
                  name='phoneNumber' 
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData(prev => ({...prev, phoneNumber: e.target.value}))}
                />
                
              </div>
              
            </label>
          </div>
          <div className='form-field'>
            <label htmlFor="password" className='form-label'>
              <span>Mật khẩu:</span>
              <div className='form-input password-input' >
                <input 
                  type="password" 
                  id='password' 
                  name='password' 
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({...prev, password: e.target.value}))}
                />
                <button 
                  type='button'
                  className="gen-btn"
                  onClick={handleGeneratePassword}
                >
                  Tự động tạo
                </button>
              </div>
              
            </label>
          </div>
          <div className='form-field avatar-field'>
            <label htmlFor="avatar" className='form-label'>
              <span>Ảnh đại diện:</span>
              <div className='form-input avatar-input' >
                <input 
                  type="file" 
                  id='avatar' 
                  name='avatar' 
                  style={{display: 'none'}}
                  onChange={handleUploadAvatar}
                />
                <img 
                  src={formData.avatar || "/image-holder2.svg"}
                  alt="avatar"
                  className="preview-avatar"
                />
              </div>
            </label>
          </div>
          <div className='form-section-title align-center'>
            Phân quyền tài khoản
          </div>
          <div className='form-role-field'>
            <div className='role-option'>
              <label htmlFor="manager" className="form-role-label">
                <input 
                  type="radio"
                  id="manager"
                  name="role"
                  value="manager"
                  onClick={(e) => setFormData(prev => ({...prev, role: e.target.value})) }
                />
                <span>Quản lý</span>
              </label>
              <p className='role-desc'>
                Bao gồm các quyền của nhân viên (quản lý kho hàng, quản lý đơn hàng, kế toán & báo cáo), 
                quyền tạo tài khoản cho nhân viên mới và xóa tài khoản nhân viên.
              </p>
            </div>
            <div className='role-option'>
              <label htmlFor="employee" className="form-role-label">
                <input 
                  type="radio"
                  id="employee"
                  name="role"
                  value="employee"
                  onChange={handleRoleChange}
                  defaultChecked={true}
                  onClick={(e) => setFormData(prev => ({...prev, role: e.target.value})) }
                />
                <span>Nhân viên</span>
              </label>
              {formData.role == "employee" && (
              <div className="employee-role-field">
                <div className='employee-option'>
                  <label htmlFor="inventory" className="employee-label">
                    <input 
                      type="checkbox"
                      id="inventory"
                      name="inventory"
                      value="inventory"
                      onChange={handleRoleChange}
                    />
                    <span>Kho hàng</span>
                  </label>
                  <p className='role-desc'>Bao gồm các quyền quản lý danh mục, quản lý sản phẩm và quản lý kho hàng</p>
                </div>
                <div className='employee-option'>
                  <label htmlFor="sales" className="employee-label">
                    <input 
                      type="checkbox"
                      id="sales"
                      name="sales"
                      value="sales"
                      onChange={handleRoleChange}
                    />
                    <span>Bán hàng</span>
                  </label>
                  <p className='role-desc'>Bao gồm quyền quản lý đơn hàng</p>
                </div>
                <div className='employee-option'>
                  <label htmlFor="accountant" className="employee-label">
                    <input 
                      type="checkbox"
                      id="accountant"
                      name="accountant"
                      value="accountant"
                      onChange={handleRoleChange}
                    />
                    <span>Kế toán</span>
                  </label>
                  <p className='role-desc'>Bao gồm quyền tạo báo cáo, thống kê doanh thu, chi phí và lợi nhuận</p>
                </div>
              </div>
              )}
            </div>
            
          </div>
          <div className='form-submit'>
            <button type="submit" className='submit-btn'>
              Thêm người dùng mới
            </button>
          </div>
          
        </form>
      </div>
      
      {isUserAdded && (
        <AccountCard 
          email={formData.email}
          username={formData.username}
          password={formData.password}
        />
      )}

    </div>
  )
}

export default AddUser