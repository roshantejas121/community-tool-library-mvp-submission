import React, { useState } from 'react';
import { toggleToolAvailability } from '../services/api';

const ToolCard = ({ tool, onUpdate }) => {
  const [borrowError, setBorrowError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleBorrow = async () => {
    setBorrowError('');
    setIsLoading(true);
    try {
      const updatedTool = await toggleToolAvailability(tool.id);
      onUpdate(updatedTool);
    } catch (error) {
      setBorrowError(error.message || 'Action failed. Server returned an error.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`tool-card ${!tool.isAvailable ? 'borrowed' : ''}`}>
      <div className="tool-header">
        <span className="tool-icon">🔧</span>
        <div>
          <h3>{tool.name}</h3>
          <span className={`status-badge ${tool.isAvailable ? 'available' : 'unavailable'}`}>
            {tool.isAvailable ? '✅ Available' : '🔴 Borrowed'}
          </span>
        </div>
      </div>
      <p>{tool.description}</p>
      <div className="tool-actions">
        <button onClick={handleBorrow} disabled={isLoading} className={tool.isAvailable ? 'borrow-btn' : 'return-btn'}>
          {isLoading ? '...' : tool.isAvailable ? 'Borrow' : 'Return'}
        </button>
      </div>
      {borrowError && <div className="borrow-error" role="alert">⚠️ {borrowError}</div>}
    </div>
  );
};

export default ToolCard;
