import React from 'react'
import "./UsersTable.css"
import stringifyUserRoles from '../../../utils/stringifyUserRoles'
import { Trash2 } from 'lucide-react'
import useAuthStore from '../../../store/useAuthStore'
import checkPermission from '../../../utils/checkPermission'
import toast from 'react-hot-toast'

const UsersTable = ({users}) => {
    const {authUser} = useAuthStore();


    const handleDeleteClick = (selectedUser) => {
        if (!checkPermission(authUser.roles, ['manager'])){
            toast.error("Bạn không có quyền thực hiện chức năng này.");
            return;
        }
        useAuthStore.setState({
            selectedUser: selectedUser,
            isDeleteMode: true
        });
    };
    

  return (
    <table className="user-table">
        <thead>
            <tr className='user-table-head'>
                <th className='align-left'>STT</th>
                <th className='align-left'>Ảnh</th>
                <th className='align-left'>Tên người dùng</th>
                <th className='align-left'>Số điện thoại</th>
                <th className='align-right'>Email</th>
                <th className='align-center'>Vai trò</th>
                <th className='align-center'>Thao tác</th>
            </tr>
        </thead>
        <tbody>
        {/* Table rows will be generated here */}
        {users?.map((user,index) => (
            <tr
                key={index}
                className='user-table-data'
            >
                <td className='align-left'>{index+1}</td>
                <td className='user-table-avatar align-left'>
                    <img 
                        src={`${user.avatar || '/hao-hao.png'}`} 
                        alt=""
                    />
                </td>
                <td className='align-left'>{user.username}</td>
                <td className='align-left'>{user.phoneNumber}</td>
                <td className='align-right'>{user.email}</td>
                <td className='align-center'>{stringifyUserRoles(user.roles)}</td>
                <td className='user-table-action align-center'>
                    <button 
                        className="delete-button"
                        onClick={() => {
                            handleDeleteClick(user);
                        }}
                    >
                        <Trash2 className='delete-icon'/>
                    </button>
                </td>
            </tr>
        ))}
        </tbody>
    </table>
  )
}

export default UsersTable