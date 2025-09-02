import React from "react";
import { Link } from "react-router-dom";
import "./CustomerList.css";

const CustomerList = ({
  customers,
  onDelete,
  currentPage = 1,
  itemsPerPage = 10,
}) => {
  if (customers.length === 0) {
    return (
      <div className="empty-state">
        <p>No customers found.</p>
      </div>
    );
  }

  const startIndex = (currentPage - 1) * itemsPerPage;

  return (
    <div className="card">
      <table className="table">
        <thead>
          <tr>
            <th>#</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Phone Number</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer, index) => (
            <tr key={customer.id}>
              <td>{startIndex + index + 1}</td>
              <td>{customer.first_name}</td>
              <td>{customer.last_name}</td>
              <td>{customer.phone_number}</td>
              <td>
                <div className="action-buttons">
                  <Link
                    to={`/customers/${customer.id}`}
                    className="btn btn-primary"
                  >
                    View
                  </Link>
                  <Link to={`/customers/${customer.id}/edit`} className="btn">
                    Edit
                  </Link>
                  <button
                    onClick={() => onDelete(customer.id)}
                    className="btn btn-danger"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerList;
