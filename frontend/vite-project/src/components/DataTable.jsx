import React from 'react'
import "./DataTable.css"
import isImageUrl from '../utils/isImageUrl'
import isValidISODate from '../utils/isValidISODate'
import { formatDateForDetail } from '../utils/formatTime'

const DataTable = ({tableHeaders, tableData, tableRowStyle, tableCellAlignedLeft, showTotal, totalData, tableFootStyle}) => {
  return (
    <table className='data-table'>
        <thead>
            <tr className='data-table-header' style={tableRowStyle}>     
                <th className='align-left'>STT</th>
                {tableHeaders.map((header, index) => (
                    <th
                        key={index}
                        className={tableCellAlignedLeft?.some(title => header.title == title)? "align-left": "align-right"}
                    >
                        {header.title}
                    </th>
                ))}
            </tr>
        </thead>
        <tbody>
            {tableData?.map((data, index) => (
            <tr key={index} className='data-table-data' style={tableRowStyle}>
                <td className='align-left'>{index+1}</td>
                {tableHeaders.map((header, index) => (
                    
                    <td
                    key={index}
                      className={tableCellAlignedLeft?.some(title => header.title == title)? "align-left": "align-right"}
                    >
                      {isImageUrl(data[header.value])? (
                      <img
                        className='product-image'
                        src={data[header.value] || "/image-holder2.svg"}
                        alt=''
                      />
                    ) : (
                      isValidISODate(data[header.value]) || header?.title == "Ngày" || header?.title == "Ngày tạo" || header?.value == "createdAt"? formatDateForDetail(data[header.value]):data[header.value].toLocaleString() 
                    )}
                    </td>
                    
                ))}
            </tr>
            ))}
        </tbody>
        {showTotal && (
        <tfoot>
          <tr className='data-table-foot' style={tableFootStyle}>
            <td></td>
            <td className='align-left'>Tổng cộng:</td>
            <td className='align-right'>{totalData?.totalQuantity.toLocaleString()}</td>
            <td className='align-right'>{totalData?.totalAmount.toLocaleString()}</td>
          </tr>
        </tfoot>
        )}
    </table>
  )
}

export default DataTable