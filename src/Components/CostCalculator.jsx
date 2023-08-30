import axios from "axios";
import { useEffect, useRef, useState } from "react";
import values from "../../values";
import "./CostCalculator.css";
import CostInput from "./CostInput";

const CostCalculator = () => {
  const [units, setUnits] = useState();
  const [garmentTotal, setGarmentTotal] = useState();
  const [decoration, setDecoration] = useState();
  const [shipping, setShipping] = useState();
  const [fees, setFees] = useState();
  const [email, setEmail] = useState("");
  const [quota, setQuota] = useState("");
  const [comments, setComments] = useState("");

  const [totalCost, setTotalCost] = useState(0);
  const [costPerUnit, setCostPerUnit] = useState(0);
  const [costPerUnitForOrder, setCostPerUnitForOrder] = useState(0);
  const [isLoading, setIsloading] = useState(false);

  const handleInputChange = (event) => {
    event.preventDefault();
    const { name, value } = event.target;

    // Remove leading minus sign and non-numeric characters
    const sanitizedValue = value.replace(/[^0-9.-]/g, "");
    // Ensure there is only one decimal point
    const sanitizedDecimalValue = sanitizedValue.replace(/(\..*?)\..*/g, "$1");

    // Limit to two decimal places and convert to a number

    switch (name) {
      case "units":
        setUnits(parseInt(sanitizedValue)); // Convert back to number
        break;
      case "garmentTotal":
        setGarmentTotal(sanitizedDecimalValue); // Convert back to number
        break;
      case "decoration":
        setDecoration(sanitizedDecimalValue); // Convert back to number
        break;
      case "shipping":
        setShipping(sanitizedDecimalValue); // Convert back to number
        break;
      case "fees":
        setFees(sanitizedDecimalValue); // Convert back to number
        break;
      case "email":
        setEmail(value);
        break;
      case "quota":
        setQuota(value);
        break;
      default:
        break;
    }
  };

  const output = useRef(null);

  const calculateTotalCost = (e) => {
    e.preventDefault();
    if (
      units &&
      garmentTotal &&
      decoration &&
      shipping &&
      fees &&
      email &&
      quota &&
      comments
    ) {
      setIsloading(true);
      const sum =
        parseFloat(garmentTotal) +
        parseFloat(decoration) +
        parseFloat(shipping) +
        parseFloat(fees);

      setTotalCost(sum);

      const costPerUnit = sum / units;
      setCostPerUnit(costPerUnit);

      let extraCostPercentage = 0;
      if (units >= 0 && units <= 12) {
        extraCostPercentage = 0.48; // 45% for 0-12 units
      } else if (units >= 13 && units <= 30) {
        extraCostPercentage = 0.43; // 40% for 13-30 units
      } else if (units >= 31 && units <= 100) {
        extraCostPercentage = 0.38; // 35% for 31-100 units
      } else if (units > 100) {
        extraCostPercentage = 0.33; // 30% for 100+ units
      }

      const costPerUnitWithExtraPercentage =
        costPerUnit * (1 + extraCostPercentage);
      setCostPerUnitForOrder(costPerUnitWithExtraPercentage);

      output.current.classList.add("show");

      const data = {
        units,
        garment_total: parseFloat(garmentTotal),
        decoration,
        shiping: shipping,
        fees: 4,
        total_cost: parseFloat(sum),
        cost_per_unit: parseFloat(sum / units).toFixed(2),
        cost_per_unit_margin_persent: parseFloat(
          ((costPerUnitWithExtraPercentage - costPerUnit) / costPerUnit) * 100
        ).toFixed(2),
        cost_per_unit_margin: parseFloat(
          costPerUnitWithExtraPercentage
        ).toFixed(2),
        email,
        quota,
        comments,
      };
      axios
        .post(`${values.baseURL}/calculator`, data)
        .then((d) => {
          console.log(d.data);
          setIsloading(false);
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      alert("Set all inputs");
    }
  };
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems([
      {
        label: "Units",
        name: "units",
        value: units,
      },
      {
        label: "garment Total",
        name: "garmentTotal",
        value: garmentTotal,
      },
      {
        label: "decoration",
        name: "decoration",
        value: decoration,
      },
      {
        label: "shipping",
        name: "shipping",
        value: shipping,
      },
      {
        label: "fees",
        name: "fees",
        value: fees,
      },
      {
        label: "Email",
        name: "email",
        value: email,
      },
      {
        label: "quota",
        name: "quota",
        value: quota,
      },
    ]);
  }, [units, garmentTotal, decoration, shipping, fees, email, quota]);

  return (
    <div className="cost-calculator">
      <h1>Cost Calculator</h1>
      <form onSubmit={(e) => calculateTotalCost(e)}>
        <div className="input-section">
          {items.map((item, i) => (
            <CostInput
              key={i}
              label={item.label}
              name={item.name}
              value={item.value}
              handler={handleInputChange}
            />
          ))}

          <div className="input-container textarea">
            <label htmlFor="comments"> Comments:</label>
            <textarea
              onChange={(e) => {
                setComments(e.target.value);
              }}
              name="comments"
              id="comments"
              value={comments}
            ></textarea>
          </div>
        </div>
        <button type="submit">
          {(isLoading && "sending") || "Calculate Total Cost"}
        </button>
      </form>
      <div ref={output} className="output-section">
        <h2>Total Cost: ${parseFloat(totalCost).toFixed(2)}</h2>
        <h2>Cost Per Unit: ${parseFloat(costPerUnit).toFixed(2)}</h2>
        <h2>
          Cost Per Unit margin:{" "}
          {parseFloat(
            ((costPerUnitForOrder - costPerUnit) / costPerUnit) * 100
          ).toFixed(2)}
          % (${parseFloat(costPerUnitForOrder).toFixed(2)})
        </h2>
      </div>
    </div>
  );
};

export default CostCalculator;
