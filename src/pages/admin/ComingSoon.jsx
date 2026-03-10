import React from 'react'

const ComingSoon = () => {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100%',
      flexDirection: 'column',
      gap: '16px'
    }}>
      <h2 style={{ color: '#6366f1' }}>Tính năng đang phát triển</h2>
      <p style={{ color: '#64748b' }}>Chúng tôi đang cập nhật tính năng này. Vui lòng quay lại sau!</p>
    </div>
  )
}

export default ComingSoon

