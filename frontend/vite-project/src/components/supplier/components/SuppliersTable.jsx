import { SquarePen, Trash2 } from 'lucide-react';
import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom';
import "./SuppliersTable.css";
import useSupplierStore from '../../../store/useSupplierStore';
import useAuthStore from '../../../store/useAuthStore';
import { formatDateForDetail } from '../../../utils/formatTime';
import checkPermission from '../../../utils/checkPermission'

const SuppliersTable = ({displayedSuppliers}) => {
    const navigate = useNavigate();
    const {authUser} = useAuthStore();


    const handleDeleteClick = (selectedSupplier) => {
        if (!checkPermission(authUser.roles, ['inventory','manager'])){
            toast.error("Bạn không có quyền thực hiện chức năng này.");
            return;
        }
        useSupplierStore.setState({selectedSupplier: selectedSupplier})
        useAuthStore.setState({
            isDeleteMode: true
        });
    };


  return (
    <table className='supplier-table'>
        <thead>
        <tr className='supplier-table-header'>
            <th className='align-center'>STT</th>
            <th className='align-left'>Tên nhà cung cấp</th>
            <th className='align-left'>Số điện thoại</th>
            <th className='align-left'>Địa chỉ</th>
            <th className='align-center'>Ngày thêm</th>
            <th className='align-center'>Thao tác</th>
        </tr>
        </thead>
        <tbody>
        {displayedSuppliers?.map((supplier,index) => (
            <tr 
            key={index}
                className='supplier-table-data'
                onClick={() => {
                    navigate('/supplier/'+supplier.id);
                }}
            >
                <td className='align-center'>{index+1}</td>
                <td className='align-left'>{supplier.name.length > 50? supplier.name.slice(0,50)+"...": supplier.name}</td>
                <td className='align-left'>{supplier.phone}</td>
                <td className='align-left'>{supplier.address.length > 25? supplier.address.slice(0,25)+"...": supplier.address}</td>
                <td className='align-center'>{formatDateForDetail(supplier.createdAt)}</td>
                <td 
                    className='supplier-item-action align-center'
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                >
                    <NavLink 
                    className='supplier-item-btn edit-btn'
                    to={`/supplier/update/${supplier.id}`}
                    >
                    <SquarePen
                        className='supplier-item-icon'
                    /> 
                    </NavLink>
                    <button className='supplier-item-btn delete-btn'>
                    <Trash2
                        className='supplier-item-icon' 
                        onClick={() => {
                            handleDeleteClick(supplier);
                        }}                    
                        />
                    </button>
                </td>
            </tr>
        ))}
        </tbody>
    </table>
  )
}

export default SuppliersTable