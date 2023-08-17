const CostInput = ({ label, name, value, handler }) => {
  const isUnitsInput = name === "units";

  return (
    <div className="input-container">
      <label htmlFor={name}>{label}:</label>
      {!isUnitsInput && <span>$</span>}
      <input
        type="text"
        id={name}
        name={name}
        value={value}
        onChange={handler}
        placeholder={isUnitsInput ? "Enter Units" : `Enter ${name}`}
        className="cost-input"
      />
    </div>
  );
};

export default CostInput;
