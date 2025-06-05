import React from 'react'
import "./ImportsTable.css";
import { formatDateForDetail } from '../../../utils/formatTime';
import { NavLink, useNavigate } from 'react-router-dom';
import useAuthStore from '../../../store/useAuthStore';
import { SquarePen, Trash2 } from 'lucide-react';
import shortenText from '../../../utils/shortenText';
import useImportStore from '../../../store/useImportStore';
import checkPermission from '../../../utils/checkPermission'

const ImportsTable = ({displayedImports}) => {
    const navigate = useNavigate();
    const {authUser} = useAuthStore();


    const handleDeleteClick = (selectedImport) => {
        if (!checkPermission(authUser.roles, ['inventory','manager'])){
            toast.error("Bạn không có quyền thực hiện chức năng này.");
            return;
        }
        useImportStore.setState({selectedImport: selectedImport})
        useAuthStore.setState({
            isDeleteMode: true
        });
    };

  return (
    <table className='import-table'>
        <thead>
            <tr className='import-table-header'>
                <th className='align-left'>STT</th>
                <th className='align-left'>Nhà cung cấp</th>
                <th className='align-right'>Số mặt hàng</th>
                <th className='align-right'>Tổng chi phí</th>
                <th className='align-right'>Ngày tạo</th>
                <th style={{justifyContent: 'center'}} className='align-center'>Thao tác</th>
            </tr>
        </thead>
        <tbody>
        {displayedImports?.map((import_,index) => (
            <tr 
            key={index}
            className='import-table-data'
            onClick={() => {
                navigate('/import/'+import_.id);
            }}
            >
                <td className='align-left'>{index+1}</td>
                <td className='align-left'>{shortenText(import_?.supplier?.name)}</td>
                <td className='align-right'>{import_.productQuantity}</td>
                <td className='align-right'>{import_.totalAmount.toLocaleString()}</td>
                <td className='align-right'>{formatDateForDetail(import_.createdAt)}</td>
                <td 
                    className='import-item-action align-center'
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                    
                >
                    <NavLink 
                    className='import-item-btn edit-btn'
                    to={`/import/update/${import_.id}`}
                    >
                    <SquarePen
                        className='import-item-icon'
                    /> 
                    </NavLink>
                    <button className='import-item-btn delete-btn'>
                    <Trash2
                        className='import-item-icon' 
                        onClick={() => {
                            handleDeleteClick(import_);
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

export default ImportsTable