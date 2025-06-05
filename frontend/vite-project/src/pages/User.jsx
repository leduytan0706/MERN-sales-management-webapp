import React, { useEffect, useState } from 'react'
import "./User.css"
import PageHeader from "../components/PageHeader"
import SearchBar from '../components/SearchBar'
import userRoles from '../utils/userRoles'
import useDebounce from '../lib/useDebounce'
import useAuthStore from '../store/useAuthStore'
import stringifyUserRoles from '../utils/stringifyUserRoles'
import { SquarePen, Trash2 } from 'lucide-react'
import UsersTable from '../components/user/components/UsersTable'
import LoadingSpinner from "../components/LoadingSpinner"
import DeleteUser from "../components/user/DeleteUser"
import { Backdrop } from '@mui/material'

const User = () => {
  const {isProcessing, isLoadingPage, isDeleteMode} = useAuthStore();
  const {getUsers, users, authUser} = useAuthStore();

  useEffect(() => {
    getUsers();
  }, []);

  if (isLoadingPage) {
    return <LoadingSpinner />
  }

  return (
    <div className='user-page'>
      <PageHeader 
        pageTitle="Người dùng"
        addRoute="/user/new"
        addButtonTitle="Thêm mới"
      />
      <div className="user-table-section">
        <UsersTable 
          users={users}
        />
      </div>
      <Backdrop
        sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
        open={isDeleteMode}
        onClick={() => {useAuthStore.setState({isDeleteMode: false})}}
      >
        <DeleteUser />
      </Backdrop>
    </div>
  )
};



export default User