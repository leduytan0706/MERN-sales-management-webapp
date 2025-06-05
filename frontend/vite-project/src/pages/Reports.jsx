import React, { useEffect, useState } from 'react'
import "./Reports.css"
import { Minus } from 'lucide-react'
import { formatDateForInput } from '../utils/formatTime';
import useAnalyticStore from '../store/useAnalyticStore';
import LoadingSpinner from '../components/LoadingSpinner';
import ReportsTable from '../components/reports/ReportsTable';
import useAuthStore from '../store/useAuthStore';

const Reports = () => {
  const {isProcessing, isLoadingPage} = useAuthStore();
  const {getReportsData} = useAnalyticStore();
  const [formData, setFormData] = useState({
    reportType: "sales",
    startDate: "",
    endDate: ""
  });

  useEffect(() => {
    getReportsData(formData);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await getReportsData(formData);
  }

  if (isLoadingPage){
    return <LoadingSpinner />
  }

  return (
    <div className='reports-page'>
      <div className="reports-page-header">
        <div className="reports-header-title align-left">
          Báo cáo
        </div>
      </div>
      <div className="reports-page-content">
        <form className="reports-filter-form" action='' onSubmit={handleSubmit}>
          <div className="filter-field report-type-field align-left">
            <label htmlFor="reportType" className="filter-label align-left">
              <span>Loại báo cáo:{" "}</span>
              <select 
                name="reportType" 
                id="reportType"
                className='report-type-select'
                value={formData.reportType}
                onChange={(e) => setFormData(prev => ({...prev, reportType: e.target.value}))}
              >
                <option value="">Chọn loại báo cáo</option>
                <option value="sales" >Doanh thu bán hàng</option>
                <option value="cost">Chi phí nhập hàng</option>
              </select>
            </label>
          </div>
          <div className="filter-field align-left">
            <label htmlFor="startDate" className="filter-label align-left">
              <span>Từ ngày:{" "}</span>
              <input 
                type="date" 
                name='startDate'
                id='startDate'  
                className='filter-date-input'
                value={formData.startDate}
                onChange={(e) => setFormData(prev => ({...prev, startDate: e.target.value}))}

              />
            </label>
          </div>
          <div className='filter-divider align-center'>
            <Minus />
          </div>
          <div className="filter-field align-left">
            <label htmlFor="endDate" className="filter-label align-left">
              <span>Đến ngày:{" "}</span>
              <input 
                type="date" 
                name='endDate'
                id='endDate'  
                className='filter-date-input'
                value={formData.endDate}
                onChange={(e) => setFormData(prev => ({...prev, endDate: e.target.value}))}
              />
            </label>
          </div>
          <div className="filter-submit align-center">
            <button
              type='submit'
              className='submit-btn'
            >
              Xem báo cáo
            </button>
          </div>
        </form>
        <hr />
        <div className="reports-table-section">
          {isProcessing? (
            <LoadingSpinner />
          ) : (
            <ReportsTable 
              reportType={formData.reportType}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default Reports