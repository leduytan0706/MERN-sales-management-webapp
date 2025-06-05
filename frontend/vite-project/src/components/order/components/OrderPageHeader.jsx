import React from 'react'
import "./OrderPageHeader.css"
import { Plus, Upload } from 'lucide-react'

const OrderPageHeader = (props) => {
  return (
    <div className="page-header">
        <div className='page-title'>
            {props.pageTitle}
        </div>
        <div></div>
        <div className='page-action'>
            <label 
                className='upload-button' 
                htmlFor='import-file'
            >
                <input 
                    type="file" 
                    id='import-file'
                    name='import-file'
                    style={{display: 'none'}}
                    accept=".csv,.xlsx"
                    multiple={false}
                />
                <Upload className='upload-icon'/> 
                <span className='button-title'>Upload File</span>
            </label>
            <button
                className='add-button'
                onClick={props.onAddClick}
            >
                <Plus className='add-icon' />
                <span 
                    className='button-title'
                >
                    {props.addButtonTitle}
                </span>
            </button>
        </div>
    </div>
  )
}

export default OrderPageHeader