import React from 'react'
import "./UploadedFilePreview.css"
import { X } from 'lucide-react'
import DataTable from './DataTable'

const UploadedFilePreview = ({tableHeaders, tableRowStyle, uploadedData, handleUploadFile, onClose, tableCellAlignedLeft}) => {
  return (
    <div className='upload-preview'>
        <div className='upload-preview-header'>
            <h3 className='header-title'>Xem trước</h3>
            <button
                className='close-btn'
                onClick={onClose}
            >
                <X className='close-icon' />
            </button>
        </div>
        <div className='upload-preview-table'>
            <DataTable 
                tableData={uploadedData}
                tableHeaders={tableHeaders}
                tableRowStyle={tableRowStyle}
                tableCellAlignedLeft={tableCellAlignedLeft}
            />
        </div>
        <div className="upload-preview-submit">
            <button
                className='submit-btn'
                onClick={handleUploadFile}
            >
                Thêm sản phẩm
            </button>
        </div>
    </div>
  )
}

export default UploadedFilePreview