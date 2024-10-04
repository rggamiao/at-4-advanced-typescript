import React from 'react';

interface ToggleProps {
  isChecked: boolean;
  handleChange: () => void;
  label: string;
}

export const Toggle: React.FC<ToggleProps> = ({ isChecked, handleChange, label }) => {
  return (
    <div className="toggle-container">
      <label className="switch">
        <input type="checkbox" checked={isChecked} onChange={handleChange} />
        <span className="slider round"></span>
      </label>
      <span>{label}</span>
    </div>
  );
};