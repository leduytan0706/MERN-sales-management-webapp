import React from 'react'
import "./AddedInfoInput.css"
import { formatDateForInput } from '../../../utils/formatTime'

const AddedInfoInput = ({formData, onInputChange, suppliers}) => {

  return (
    <div className='added-info'>
        <div className="form-field date-field">
            <label htmlFor="importDate" className="form-label">
            <span>Ngày nhập hàng</span>
            <input 
                type="date" 
                name="importDate" 
                id="importDate" 
                className="form-input"
                value={formatDateForInput(formData?.importDate)}
                onChange={(e) => {
                    onInputChange((prev) => ({...prev, importDate: e.target.value}));
                }}
            />
            </label>
        </div>
        <div className="form-field supplier-field">
            <label htmlFor="supplier" className="form-label">
                <span>Nhà cung cấp</span>
                <select 
                    id="supplier" 
                    name="supplier" 
                    className="form-input"
                    value={formData.supplierId} 
                    onChange={(e) => {
                        onInputChange((prev) => ({...prev, supplierId: e.target.value}))
                    }}
                >
                    <option value="" defaultValue>Chọn nhà cung cấp</option>
                    {suppliers.map((supplier, index) => (
                    <option key={index} value={supplier.id}>{supplier.name}</option>
                    ))}
                </select>
            </label>
        </div>
        <div className="form-field note-field">
            <label htmlFor="note" className="form-label">
                <span>Ghi chú</span>
                <textarea 
                    id="note" 
                    name="note" 
                    value={formData.note}
                    className="form-input"
                    onChange={(e) => {
                        onInputChange((prev) => ({...prev, note: e.target.value}))
                    }}
                />
            </label>
        </div>
    </div>
  )
}

export default AddedInfoInput