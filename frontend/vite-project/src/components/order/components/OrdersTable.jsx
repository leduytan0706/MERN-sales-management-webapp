import { SquarePen, Trash2 } from 'lucide-react';
import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom';
import "./OrdersTable.css"
import useAuthStore from '../../../store/useAuthStore';
import { formatDateForDetail } from '../../../utils/formatTime';
import DeleteOrder from '../DeleteOrder';
import useOrderStore from '../../../store/useOrderStore';
import checkPermission from '../../../utils/checkPermission'

const OrdersTable = ({displayedOrders}) => {
    const navigate = useNavigate();

    const {authUser} = useAuthStore();


    const handleDeleteClick = (selectedOrder) => {
        if (!checkPermission(authUser.roles, ['sales','manager'])){
            toast.error("Bạn không có quyền thực hiện chức năng này.");
            return;
        }
        useOrderStore.setState({selectedOrder: selectedOrder})
        useAuthStore.setState({
            isDeleteMode: true
        });
    };
  return (
    <table className='order-table'>
        <thead>
        <tr className='order-table-header'>
            <th className='align-left'>STT</th>
            <th className='align-left'>Tên khách hàng</th>
            <th className='align-right'>Số mặt hàng</th>
            <th className='align-right'>Tổng số</th>
            <th className='align-right'>Tổng tiền</th>
            <th className='align-right'>Ngày tạo</th>
            <th className='align-center'>Thao tác</th>
        </tr>
        </thead>
        <tbody>
        {displayedOrders.map((order,index) => (
            <tr 
            key={index}
            className='order-table-data'
            onClick={() => {
                navigate('/order/'+order._id);
            }}
            >
            <td className='align-left'>{index+1}</td>
            <td className='align-left'>{order.customerName || "Guest"}</td>
            <td className='align-right'>{order.itemQuantity}</td>
            <td className='align-right'>{order.totalItem}</td>
            <td className="align-right">{order.totalAmount.toLocaleString()}</td>
            <td className='align-right'>{formatDateForDetail(order.createdAt)}</td>
            <td 
                className='order-item-action'
                onClick={(e) => {
                    e.stopPropagation();
                }}
            >
                <NavLink 
                className='order-item-btn edit-btn'
                to={`/order/update/${order._id}`}
                >
                <SquarePen
                    className='order-item-icon'
                /> 
                </NavLink>
                <button className='order-item-btn delete-btn'>
                <Trash2
                    className='order-item-icon' 
                    onClick={() => {
                        handleDeleteClick(order);
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

export default OrdersTable