import React from 'react'
import "./PageHeader.css"
import { Plus, Upload } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import useAuthStore from '../store/useAuthStore'

const PageHeader = ({pageTitle, addRoute, addButtonTitle, uploadedFile, handleUploadedFile}) => {


  return (
    <div className="page-header">
        <div className='page-title align-left'>
            {pageTitle}
        </div>
        <div className='page-action align-right'>
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
                    onChange={handleUploadedFile}
                />
                <Upload className='upload-icon'/> 
                <span className='button-title'>Tải lên</span>
            </label>
            <NavLink
                className='add-button'
                to={addRoute}
            >
                <Plus className='add-icon' />
                <span 
                    className='button-title'
                >
                    {addButtonTitle}
                </span>
            </NavLink>
        </div>
    </div>
  )
}

export default PageHeader