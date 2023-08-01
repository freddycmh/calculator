import React, { useState, useEffect } from 'react';
import CostInput from './CostInput';
import './CostCalculator.css';

const CostCalculator = () => {
  const [units, setUnits] = useState(0);
  const [garmentTotal, setGarmentTotal] = useState(0);
  const [decoration, setDecoration] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [fees, setFees] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [costPerUnit, setCostPerUnit] = useState(0);
  const [costPerUnitForOrder, setCostPerUnitForOrder] = useState(0);

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    // Remove leading minus sign and non-numeric characters
    const sanitizedValue = parseInt(value.replace(/^-|[^0-9]/g, ''), 10);

    switch (name) {
      case 'units':
        setUnits(sanitizedValue);
        break;
      case 'garmentTotal':
        setGarmentTotal(sanitizedValue);
        break;
      case 'decoration':
        setDecoration(sanitizedValue);
        break;
      case 'shipping':
        setShipping(sanitizedValue);
        break;
      case 'fees':
        setFees(sanitizedValue);
        break;
      default:
        break;
    }
  };

  const calculateTotalCost = () => {
    const sum = garmentTotal + decoration + shipping + fees;
    setTotalCost(sum);

    const costPerUnit = sum / units;
    setCostPerUnit(costPerUnit);

    let extraCostPercentage = 0;
    if (units >= 0 && units <= 12) {
      extraCostPercentage = 0.45; // 45% for 0-12 units
    } else if (units >= 13 && units <= 30) {
      extraCostPercentage = 0.40; // 40% for 13-30 units
    } else if (units >= 31 && units <= 100) {
      extraCostPercentage = 0.35; // 35% for 31-100 units
    } else if (units > 100) {
      extraCostPercentage = 0.30; // 30% for 100+ units
    }

    const costPerUnitWithExtraPercentage = costPerUnit * (1 + extraCostPercentage);
    setCostPerUnitForOrder(costPerUnitWithExtraPercentage);
  };

  useEffect(() => {
    calculateTotalCost();
  }, []);

  useEffect(() => {
    calculateTotalCost();
  }, [units, garmentTotal, decoration, shipping, fees]);

  return (
    <div className="cost-calculator">
      <h1>Cost Calculator</h1>
      <div className="input-section">
        <CostInput
          label="Units"
          name="units"
          value={units}
          onChange={handleInputChange}
        />
        <CostInput
          label="Garment Total"
          name="garmentTotal"
          value={garmentTotal}
          onChange={handleInputChange}
        />
        <CostInput
          label="Decoration"
          name="decoration"
          value={decoration}
          onChange={handleInputChange}
        />
        <CostInput
          label="Shipping"
          name="shipping"
          value={shipping}
          onChange={handleInputChange}
        />
        <CostInput
          label="Fees"
          name="fees"
          value={fees}
          onChange={handleInputChange}
        />
      </div>
      <button onClick={calculateTotalCost}>Calculate Total Cost</button>
      <div className="output-section">
        <h2>Total Cost: ${totalCost.toFixed(2)}</h2>
        <h2>Cost Per Unit: ${costPerUnit.toFixed(2)}</h2>
        <h2>
          Cost Per Unit margin: {((costPerUnitForOrder - costPerUnit) / costPerUnit * 100).toFixed(2)}% (${costPerUnitForOrder.toFixed(2)})
        </h2>
      </div>
    </div>
  );
};

export default CostCalculator;
