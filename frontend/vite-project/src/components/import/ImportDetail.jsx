import React, { useEffect } from 'react'
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';
import { CircularProgress } from '@mui/material';
import useImportStore from '../../store/useImportStore';
import { ArrowLeft, Printer } from 'lucide-react';
import "./ImportDetail.css";
import {formatDateForDetail} from '../../utils/formatTime';
import toast from 'react-hot-toast';
import formateDateVn from '../../utils/formatDate';

const ImportDetail = () => {
  const {id} = useParams();
  const {isLoadingPage} = useAuthStore();
  const {getImportById, selectedImport, importItems} = useImportStore();

  useEffect(() => {
    getImportById(id);
  }, [id]);



  if (isLoadingPage || !selectedImport){
    return <CircularProgress color="primary" />;
  }

  return (
    <div className='import-detail'>
        <div className="detail-header">
          <div className='detail-title'>
            <NavLink
                className='back-btn'
                to="/import"
            >
                <ArrowLeft />
            </NavLink>
            <h1>Chi tiết nhập hàng</h1>
          </div>
          <div className='print-section'>
            <button className='print-btn'>
              <Printer 
                className='print-icon' 
              />
              <span>In</span>
            </button>
          </div>
        </div>
        
        <div className="detail-section">
          <div className='added-info'>
            <div className="detail-card date">
              <h3>
                Ngày nhập hàng
              </h3>
              <h4>{formatDateForDetail(selectedImport?.createdAt || "")}</h4>
            </div>
            <div className="detail-card supplier">
              <h3>
                Nhà cung cấp
              </h3>
              <h4>{selectedImport?.supplier?.name}</h4>
            </div>
            <div className="detail-card note">
              <h3>
                Ghi chú
              </h3>
              <h4>{selectedImport?.note}</h4>
            </div>
          </div>
          <div className='product-info'>
            <div className='products-section'>
              <span className='section-title'>Mặt hàng</span>
              {importItems?.length === 0? (
                <h3>Không có mặt hàng nào</h3>
              ): (
              <table className='import-product-table'>
                <thead >
                  <tr className='product-table-head'>
                    <th className='align-left'>STT</th>
                    <th className='align-left'>Tên sản phẩm</th>
                    <th className='align-left'>Đơn vị</th>
                    <th >
                      <span className='align-center'>Nhập hàng</span>
                      <table className='product-subtable'>
                        <tbody>
                          <tr className='product-subtable-head1'>
                            <th className='align-right'>Số lượng</th>
                            <th className='align-right'>Đơn giá</th>
                            <th className='align-right'>Tổng</th>
                          </tr>
                        </tbody>
                      </table>
                    </th>

                    <th >
                      <span className='align-center'>Xuất hàng</span>
                      <table className='product-subtable'>
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
                      <table className='product-subtable'>
                        <tbody>
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
                  {importItems.map((item, index) => (
                  <tr key={index} className='product-table-data'>
                    <td className='align-left'>{index + 1}</td>
                    <td className='align-left'>{item.product.name}</td>
                    <td className='align-left'>{item.product.unit}</td>
                    
                    <td>
                      <table className='product-subtable'>
                        <tbody>
                          <tr className='product-subtable-data1'>
                            <td className='align-right'>{item.importQuantity}</td>
                            <td className='align-right'>{item.importPrice.toLocaleString()}</td>
                            <td className='align-right'>{item.importTotal.toLocaleString()}</td>
                          </tr>
                        </tbody>
                        
                      </table>
                    </td>
                    <td>
                      <table className='product-subtable'>
                        <tbody>
                          <tr className='product-subtable-data1'>
                            <td className='align-right'>{item.exportQuantity}</td>
                            <td className='align-right'>{item.exportPrice.toLocaleString()}</td>
                            <td className='align-right'>{item.exportTotal.toLocaleString()}</td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                    <td>
                      <table className='product-subtable'>
                        <tbody>
                          <tr className='product-subtable-data2'>
                            <td className='align-right'>{item.importQuantity - item.exportQuantity}</td>
                            <td className='align-right'>{item.stockTotal.toLocaleString()}</td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                    <td className='align-center'>{formateDateVn(item.expiringDate)}</td>
                  </tr>
                  ))}

                </tbody>
                <tfoot>
                  <tr className='product-table-foot' >
                    <td></td>
                    <td >Tổng chi phí</td>
                    <td className='align-right'>{selectedImport.totalAmount.toLocaleString()}</td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
              )}
              
            </div>
          </div>
          
        </div>
    </div>
  )
}

export default ImportDetail