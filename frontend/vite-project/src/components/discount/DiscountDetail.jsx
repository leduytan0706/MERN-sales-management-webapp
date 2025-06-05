import React, { useEffect } from 'react'
import "./DiscountDetail.css"
import { useParams } from 'react-router-dom'
import useDiscountStore from '../../store/useDiscountStore';
import { formatDateForDetail } from '../../utils/formatTime';
import AddUpdateHeader from '../AddUpdateHeader';

const DiscountDetail = () => {
  const {id} = useParams();
  const {getDiscountById, selectedDiscount} = useDiscountStore();

  useEffect(() => {
    if (id) {
      getDiscountById(id);
    }
  }, [id])
  return (
    <div className='discount-detail'>
      <AddUpdateHeader 
        headerTitle={"Chi tiết khuyến mãi"}
      />

      <div className="discount-detail-section">
        <div className="basic-info">
          <div className='detail-section-title align-center'>Thông tin cơ bản</div>
          <div className="detail-card code-card">
            <label htmlFor="code" className="form-label">
              <span className='form-name'>Mã chương trình:</span>
              <input 
                type='text'
                id='code'
                name='code'
                value={selectedDiscount?.autoApply? "Tự động áp dụng": selectedDiscount?.code}
                disabled={true}
              />
            </label>
            <div className="auto-apply-checkbox">
              <label htmlFor="autoApply">
                <input
                  type="checkbox"
                  id="autoApply"
                  name="autoApply"
                  disabled={true}
                  checked={selectedDiscount?.autoApply}
                />
                <span>Tự động áp dụng</span>
              </label>
            </div>
          </div>
          <div className="detail-card">
            <h4 className='form-name'>Tên chương trình:</h4>
            <p>{selectedDiscount?.name}</p>
          </div>
          <div className="detail-card">
            <h4 className='form-name'>Ngày bắt đầu:</h4>
            <p>{formatDateForDetail(selectedDiscount?.createdAt)}</p>
          </div>
          <div className="detail-card date-card">
            <h4 className='form-name'>Ghi chú:</h4>
            <p>{selectedDiscount?.note}</p>
          </div>
          <div className="detail-card date-card">
            <h4 className='form-name'>Ngày kết thúc:</h4>
            <p>{formatDateForDetail(selectedDiscount?.endDate)}</p>
          </div>
        </div>
        <div className="range-info">
          <div className='detail-section-title align-center'>Thông tin khuyến mãi</div>
          <div className="detail-card">
            <h4 className='card-name'>Khuyến mãi theo:</h4>
            <p>{selectedDiscount?.applyType === "item"? "Mặt hàng": "Đơn hàng"}</p>
          </div>
          <div className="detail-card">
            <h4 className='card-name'>Điều kiện:</h4>
            <p>{selectedDiscount?.minQuantity > 0? "Số lượng tối thiểu": "Giá trị tối thiểu"}</p>
          </div>
          <div className="detail-card">
            <h4 className='card-name'>Giảm giá theo:</h4>
            <p>{selectedDiscount?.discountPercentage > 0? "Phần trăm": "Lượng tiền"}</p>
          </div>
          <div className="detail-card">
            <h4 className='card-name'>{selectedDiscount?.minQuantity > 0? "Số lượng tối thiểu": "Giá trị tối thiểu"}</h4>
            <p>{selectedDiscount?.minQuantity > 0? selectedDiscount?.minQuantity: selectedDiscount?.minAmount}</p>
          </div>
          <div className="detail-card">
            <h4 className='card-name'>Giảm giá tối đa</h4>
            <p>{selectedDiscount?.maxDiscount || 0}</p>
          </div>
          <div className="detail-card">
            <h4 className='card-name'>{selectedDiscount?.discountPercentage > 0? "Phần trăm giảm giá": "Lượng tiền giảm giá"}</h4>
            <p>{selectedDiscount?.discountPercentage > 0? selectedDiscount?.discountPercentage: selectedDiscount?.discountAmount}</p>
          </div>
          {selectedDiscount?.applyType === "item" && (
          <div className="detail-card selection-card">
            <h4 className='card-name'>Áp dụng cho:</h4>
            <p>{itemOptionMap[selectedDiscount?.itemOption]}</p>
            {selectedDiscount?.itemOption === "category" && (
            <h5>{selectedDiscount?.category?.name}</h5>
            )}
            {selectedDiscount?.itemOption === "optional" && (
              <div className='optional-items-list'>
                {selectedDiscount?.products?.map((item, index) => (
                  <div 
                    key={index}
                    className="selected-item-card align-left"
                  >
                    <div className="item-info align-left">
                      <img src={item.image || "/image-holder2.svg"} alt="" />
                      <p>{item.name}</p>
                    </div>
                  </div>
                ))}
                
              </div>
            )}
            
          </div>
          )}
          
        </div>            
      </div>
    </div>
  )
}

const itemOptionMap = {
  "all": "Tất cả các mặt hàng",
  "category": "Các mặt hàng theo danh mục",
  "optional": "Các mặt hàng tùy chọn"
};


export default DiscountDetail