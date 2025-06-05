import React from 'react'
import "./ImportInputTable.css"
import { X } from 'lucide-react';
import { formatDateForInput } from '../../../utils/formatTime';

const ImportInputTable = ({importItems, onInputChange, onDeleteItem, totalAmount}) => {
  return (
    <table className="import-input-table">
        <thead >
            <tr className='product-table-head'>
                <th className='align-left'>STT</th>
                <th className='align-left'>Tên sản phẩm</th>
                <th className='align-left'>Đơn vị</th>
                <th >
                    <span className='align-center'>Nhập hàng</span>
                    <table className='product-subtable1'>
                        <tbody>
                            <tr className='product-subtable-head1'>
                                <th className='align-right'>Số lượng</th>
                                <th className='align-right'>Đơn giá</th>
                                <th className='align-right'>Tổng </th>
                            </tr>
                        </tbody>
                    </table>
                </th>

                <th >
                    <span className='align-center'>Xuất hàng</span>
                    <table className='product-subtable1'>
                        <tbody>
                            <tr className='product-subtable-head1'>
                                <th className='align-right'>Số lượng</th>
                                <th className='align-right'>Đơn giá</th>
                                <th className='align-right'>Tổng </th>
                            </tr>
                        </tbody>
                    </table>
                </th>
                <th>
                    <span className='align-center'>Tồn</span>
                    <table className='product-subtable2'>
                        <tbody >
                            <tr className='product-subtable-head2'>
                                <th className='align-right'>Số lượng</th>
                                <th className='align-right'>Tổng</th>
                            </tr>
                        </tbody>
                    </table>
                </th>
                <th className='align-center'>Ngày hết hạn</th>
            </tr>
        </thead>
        
        <tbody >
        {importItems.length === 0? (
            <tr className='product-table-data'>
            <td className='align-left'></td>
            <td className='align-left'></td>
            <td className='align-left'></td>
            <td className='align-left'></td>
            
            <td>
                <table >
                    <tbody>
                        <tr className='product-subtable-data1'>
                            <td className='align-right'>{}</td>
                            <td className='align-right'>{}</td>
                            <td className='align-right'>{}</td>
                        </tr>
                    </tbody>
                </table>
            </td>
            <td>
                <table className='.import-data-stock'>
                    <tbody>
                        <tr className='product-subtable-data1'>
                            <td className='align-right'>{}</td>
                            <td className='align-right'>{}</td>
                            <td className='align-right'>{}</td>
                        </tr>
                    </tbody>
                </table>
            </td>
            <td>
                <table >
                    <tbody>
                        <tr className='product-subtable-data2'>
                            <td className='align-right'>{}</td>
                            <td className='align-right'>{}</td>
                        </tr>
                    </tbody>
                </table>
            </td>
            <td className='align-center'>{}</td>
            </tr>
        ) : (
        <>
            {importItems.map((item, index) => (
            <tr key={index} className='product-table-data'>
                <td className='align-left'>{index + 1}</td>
                <td className='align-left'>{item.product.name}</td>
                <td className='align-left'>{item.product.unit}</td>
                
                <td>
                    <table >
                        <tbody>
                            <tr className='product-subtable-data1'>
                                <td className='align-right'>
                                    <input 
                                        type="number" 
                                        name="importQuantity" 
                                        id="importQuantity"
                                        className='import-input'
                                        placeholder='0'
                                        value={item.importQuantity > 0? item.importQuantity: ""}
                                        onChange={(e) => onInputChange(index, "importQuantity", e.target.value)}
                                    />
                                </td>
                                <td className='align-right'>
                                    <input 
                                        type="number" 
                                        name="importPrice" 
                                        id="importPrice"
                                        className='import-input'
                                        placeholder='0'
                                        value={item.importPrice > 0? item.importPrice: ""}
                                        onChange={(e) => onInputChange(index, "importPrice", e.target.value)}
                                    />
                                </td>
                                <td className='align-right'>{item.importTotal.toLocaleString()}</td>
                            </tr>
                        </tbody>
                    </table>
                </td>
                <td>
                    <table >
                        <tbody>
                            <tr className='product-subtable-data1'>
                                <td className='align-right'>
                                    <input 
                                        type="number" 
                                        name="exportQuantity" 
                                        id="exportQuantity"
                                        className='import-input'
                                        placeholder='0'
                                        value={item.exportQuantity > 0? item.exportQuantity: ""}
                                        onChange={(e) => onInputChange(index, "exportQuantity", e.target.value)}
                                    />
                                </td>
                                <td className='align-right'>
                                    <input 
                                        type="number" 
                                        name="exportPrice" 
                                        id="exportPrice"
                                        className='import-input'
                                        placeholder='0'
                                        value={item.exportPrice > 0? item.exportPrice: ""}
                                        onChange={(e) => onInputChange(index, "exportPrice", e.target.value)}
                                    />
                                </td>
                                <td className='align-right'>{item.exportTotal.toLocaleString()}</td>
                            </tr>
                        </tbody>
                    </table>
                </td>
                <td>
                    <table className='import-data-stock'>
                        <tbody>
                            <tr className='product-subtable-data2'>
                                <td className='align-right stock-data'>{item.importQuantity - item.exportQuantity}</td>
                                <td className='align-right stock-data'>{item.stockTotal.toLocaleString()}</td>
                            </tr>
                        </tbody>
                    </table>
                </td>
                <td className='align-center import-date-input'>
                    <input 
                        type="date" 
                        name="expiringDate" 
                        id="expiringDate" 
                        className='date-input'
                        value={formatDateForInput(item.expiringDate)}
                        onChange={(e) => {
                            console.log(e.target.value);
                            onInputChange(index, "expiringDate", e.target.value);
                        }}
                    />
                </td>
                <td className='align-center'>
                    <X 
                        className='delete-item-btn'
                        onClick={() => {
                            onDeleteItem(index);
                        }}    
                    />
                </td>
            </tr>
            ))}
        </>
        )}
        </tbody>
        
        <tfoot>
            <tr className='product-table-foot' >
            <td></td>
            <td className='align-left'>Tổng tiền</td>
            <td className='align-right'>{totalAmount.toLocaleString()}</td>
            <td></td>
            </tr>
        </tfoot>
    </table>)
}

export default ImportInputTable