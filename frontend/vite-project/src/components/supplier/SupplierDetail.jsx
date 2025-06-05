import React from 'react'
import './SupplierDetail.css'
import { ArrowLeft } from 'lucide-react'
import useAuthStore from '../../store/useAuthStore'
import useSupplierStore from '../../store/useSupplierStore'
import { NavLink, useParams } from 'react-router-dom'
import AddUpdateHeader from '../AddUpdateHeader'

const SupplierDetail = () => {
    const {id} = useParams();
    const {getSupplierById} = useSupplierStore();

    const selectedSupplier = getSupplierById(id);

    
  return (
    <div className='supplier-detail'>
        <AddUpdateHeader 
            onReturn="/supplier"
            headerTitle="Chi tiết nhà cung cấp"
        />
        
        <div className="detail-section">
            <div className="supplier-info">
                <div className="supplier-card one">
                    <div className="supplier-name">
                        <h3>Tên nhà cung cấp</h3>
                        <h4>{selectedSupplier.name}</h4>
                    </div>
                    <div className="supplier-phone">
                        <h3>Số điện thoại</h3>
                        <h4>{selectedSupplier.phone}</h4>
                    </div>
                </div>
                <div className="supplier-card two">
                    <h3>Địa chỉ</h3>
                    <h4>{selectedSupplier.address}</h4>
                </div>
                <div className="supplier-card three">
                    <div className="supplier-avatar">
                        <h3>Ảnh đại diện</h3>
                        <img src="/avatar.png" alt="" />
                    </div>
                    <div className="supplier-note">
                        <h3>Ghi chú</h3>
                        <h4>{selectedSupplier.note}</h4>
                    </div>
                </div>
            </div>
        </div>
    </div>
    )
}

export default SupplierDetail