import React from 'react'
import "./DeleteCard.css"
import useAuthStore from '../store/useAuthStore';
import { CircularProgress } from '@mui/material';

const DeleteCard = ({text, onDelete, itemId}) => {
    const {isProcessing} = useAuthStore();
    
    const handleDelete = async () => {
        // Logic to delete category
        await onDelete(itemId);
        useAuthStore.setState({isDeleteMode: false})
    }


  return (
    <div className='delete-card'>
        <div className='card-title'>
            <h3>Xác nhận xóa</h3>
        </div>
        <div className='card-content'>
            <h2>Bạn có chắc chắn mình muốn xóa {text} này?</h2>
            <div className='card-action'>
                <button 
                    className='cancel-btn'
                    onClick={() => {
                        useAuthStore.setState({isDeleteMode: false})
                    }}
                >
                    Hủy bỏ
                </button>
                <button 
                    className='delete-btn'
                    onClick={handleDelete}
                >
                    {isProcessing? (
                    <div className='align-center'>
                        <CircularProgress size={20} />
                    </div>
                    ) : (
                        "Xác nhận"
                    )}
                </button>
            </div>
        </div>
    </div>
  )
}

export default DeleteCard