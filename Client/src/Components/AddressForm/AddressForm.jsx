import React, { useState } from "react";
import "./AddressForm.css";

const AddressForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    address_details: "",
    city: "",
    state: "",
    pin_code: "",
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.address_details.trim()) {
      newErrors.address_details = "Address details are required";
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!formData.state.trim()) {
      newErrors.state = "State is required";
    }

    if (!formData.pin_code.trim()) {
      newErrors.pin_code = "Pin code is required";
    } else if (!/^\d{6}$/.test(formData.pin_code)) {
      newErrors.pin_code = "Pin code must be 6 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="address-form">
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Address Details</label>
          <input
            type="text"
            name="address_details"
            value={formData.address_details}
            onChange={handleChange}
            className="form-input"
            placeholder="Street, building, etc."
          />
          {errors.address_details && (
            <span className="error">{errors.address_details}</span>
          )}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">City</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="form-input"
          />
          {errors.city && <span className="error">{errors.city}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">State</label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            className="form-input"
          />
          {errors.state && <span className="error">{errors.state}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">Pin Code</label>
          <input
            type="text"
            name="pin_code"
            value={formData.pin_code}
            onChange={handleChange}
            className="form-input"
            placeholder="6 digits"
            maxLength="6"
          />
          {errors.pin_code && <span className="error">{errors.pin_code}</span>}
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          Add Address
        </button>
        <button type="button" onClick={onCancel} className="btn">
          Cancel
        </button>
      </div>
    </form>
  );
};

export default AddressForm;
