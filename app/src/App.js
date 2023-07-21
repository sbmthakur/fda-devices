import React, { useState, useEffect } from 'react';
import './App.css'; 

const App = () => {
  const [dropdownOptions, setDropdownOptions] = useState([]);
  const [selectedValue, setSelectedValue] = useState(null);
  const [classificationData, setClassificationData] = useState(null);
  const [locationsData, setLocationsData] = useState(null);
  const [recallsData, setRecallsData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/devices');
        const data = await response.json();
        const options = data.map((item) => item.product_codes[0].code);
        setDropdownOptions(options);
      } catch (error) {
        console.error('Error fetching device data:', error);
      }
    };

    fetchData();
  }, []);

  const handleDropdownChange = (event) => {
    setSelectedValue(event.target.value);
  };

  const handleButtonClick = async () => {
    try {
      const classificationResponse = await fetch('/classification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ product_code: selectedValue }),
      });
      const classificationData = await classificationResponse.json();
      setClassificationData(classificationData);

      const locationsResponse = await fetch('/locations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ product_code: selectedValue }),
      });
      const locationsData = await locationsResponse.json();
      setLocationsData(locationsData);

      const recallsResponse = await fetch('/recalls', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ product_code: selectedValue }),
      });
      const recallsData = await recallsResponse.json();
      setRecallsData(recallsData);
    } catch (error) {
      console.error('Error fetching classification and locations data:', error);
    }
  };

  return (
    <div className="device-app-container">
      <h1>Device App</h1>
      <div className="dropdown-container">
        <label htmlFor="product-code-dropdown">Select a product code:</label>
        <select
          id="product-code-dropdown"
          value={selectedValue}
          onChange={handleDropdownChange}
        >
          <option value="">Select a product code</option>
          {dropdownOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
      <button
        className="fetch-button"
        onClick={handleButtonClick}
        disabled={!selectedValue}
      >
        Fetch Classification, Locations and Recalls
      </button>

      {classificationData && (
        <div className="response-container">
          <h2>Classification Data:</h2>
          <pre>{JSON.stringify(classificationData, null, 2)}</pre>
        </div>
      )}

      {locationsData && (
        <div className="response-container">
          <h2>Locations Data:</h2>
          <pre>{JSON.stringify(locationsData, null, 2)}</pre>
        </div>
      )}

      {recallsData && (
        <div className="response-container">
          <h2>Recalls Data:</h2>
          <pre>{JSON.stringify(recallsData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default App;
