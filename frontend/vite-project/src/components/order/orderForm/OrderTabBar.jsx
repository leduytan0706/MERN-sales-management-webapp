import React from 'react'
import useOrderStore from '../../../store/useOrderStore';
import { X, Plus } from 'lucide-react';
import "./OrderTabBar.css"

const OrderTabBar = ({newOrders, activeOrderId, onRemoveTab, onAddTab, isAddMode}) => {
  return (
    <div className='order-tabbar'>
        {newOrders.map((newOrder, index) => (
        <div 
            key={index}
            className={`${newOrder.orderId===activeOrderId?"active-tabcard":"order-tabcard"}`}
            onClick={() => {
                if (isAddMode && newOrder.orderId!==activeOrderId){
                    useOrderStore.setState({activeOrderId: newOrder.orderId});
                }
            }}
        >
            <span>Đơn {index+1}</span>
            {isAddMode && (
                <X
                className='remove-btn'
                onClick={(e) => {
                    e.stopPropagation();
                    onRemoveTab(newOrder.orderId);
                }}
            />
            )}
        </div>
        ))}
    
        {isAddMode && (
        <div 
            className="add-btn"
            onClick={() => {
                onAddTab();
            }}
        >
            <Plus  
                className='add-icon'
            />
        </div>
        )}
        
    </div>
  )
}

export default OrderTabBar