import React from 'react';

const CostInput = ({ label, name, value, onChange }) => {
  const isUnitsInput = name === 'units';

  return (
    <div className="input-container">
      <label htmlFor={name}>{label}:</label>
      {!isUnitsInput && <span>$</span>}
      <input
        type="text"
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={isUnitsInput ? 'Enter Units' : ''}
        className="cost-input"
      />
    </div>
  );
};

export default CostInput;
