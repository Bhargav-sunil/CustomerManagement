import React from "react";
import "./AddressList.css";

const AddressList = ({ addresses, onDelete }) => {
  if (addresses.length === 0) {
    return (
      <div className="empty-state">
        <p>No addresses found for this customer.</p>
      </div>
    );
  }

  return (
    <div className="address-list">
      {addresses.map((address) => (
        <div key={address.id} className="address-card">
          <div className="address-details">
            <p>
              <strong>Address:</strong> {address.address_details}
            </p>
            <p>
              <strong>City:</strong> {address.city}
            </p>
            <p>
              <strong>State:</strong> {address.state}
            </p>
            <p>
              <strong>Pin Code:</strong> {address.pin_code}
            </p>
          </div>
          <div className="address-actions">
            <button
              onClick={() => onDelete(address.id)}
              className="btn btn-danger"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AddressList;
