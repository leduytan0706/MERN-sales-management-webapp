import React, { useEffect } from 'react'
import "./DeleteUser.css"
import useAuthStore from '../../store/useAuthStore'
import DeleteCard from '../DeleteCard';
import checkPermission from '../../utils/checkPermission';
import toast from 'react-hot-toast';

const DeleteUser = () => {
  const {selectedUser, deleteUser} = useAuthStore();

  return (
    <DeleteCard 
      text="người dùng"
      itemId={selectedUser?.id}
      onDelete={deleteUser}
    />
  )
}

export default DeleteUser