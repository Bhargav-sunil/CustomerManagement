import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import AddressList from "../../Components/AddressList/AddressList";
import AddressForm from "../../Components/AddressForm/AddressForm";
import { customersAPI, addressesAPI } from "../../Api/axios";
import "./CustomerDetailPage.css";

const CustomerDetailPage = () => {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);

  const fetchCustomerData = async () => {
    try {
      setLoading(true);
      const [customerResponse, addressesResponse] = await Promise.all([
        customersAPI.getById(id),
        addressesAPI.getByCustomerId(id),
      ]);

      setCustomer(customerResponse.data);
      setAddresses(addressesResponse.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch customer data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomerData();
  }, [id]);

  const handleAddAddress = async (addressData) => {
    try {
      await addressesAPI.create(id, addressData);
      setShowAddressForm(false);
      fetchCustomerData();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add address");
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      try {
        await addressesAPI.delete(addressId);
        fetchCustomerData();
      } catch (err) {
        setError(err.response?.data?.error || "Failed to delete address");
      }
    }
  };

  if (loading) {
    return <div className="container loading">Loading customer details...</div>;
  }

  if (error) {
    return (
      <div className="container">
        <div className="error-card">
          <p>{error}</p>
          <Link to="/customers" className="btn btn-primary">
            Back to Customers
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">
          Customer: {customer.first_name} {customer.last_name}
        </h1>
        <Link to="/customers" className="btn">
          Back to Customers
        </Link>
      </div>

      <div className="card customer-details">
        <h2>Customer Information</h2>
        <div className="detail-grid">
          <div className="detail-item">
            <strong>ID:</strong> {customer.id}
          </div>
          <div className="detail-item">
            <strong>First Name:</strong> {customer.first_name}
          </div>
          <div className="detail-item">
            <strong>Last Name:</strong> {customer.last_name}
          </div>
          <div className="detail-item">
            <strong>Phone Number:</strong> {customer.phone_number}
          </div>
        </div>
        <div className="action-buttons">
          <Link to={`/customers/${id}/edit`} className="btn btn-primary">
            Edit Customer
          </Link>
        </div>
      </div>

      <div className="card">
        <div className="address-header">
          <h2>Addresses</h2>
          <button
            onClick={() => setShowAddressForm(!showAddressForm)}
            className="btn btn-success"
          >
            {showAddressForm ? "Cancel" : "Add New Address"}
          </button>
        </div>

        {showAddressForm && (
          <AddressForm
            onSubmit={handleAddAddress}
            onCancel={() => setShowAddressForm(false)}
          />
        )}

        <AddressList addresses={addresses} onDelete={handleDeleteAddress} />
      </div>
    </div>
  );
};

export default CustomerDetailPage;
