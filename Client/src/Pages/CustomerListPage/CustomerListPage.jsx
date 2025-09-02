import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CustomerList from "../../Components/CustomerList/CustomerList";
import { customersAPI } from "../../Api/axios";
import "./CustomerListPage.css";

const CustomerListPage = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const fetchCustomers = async (page = 1, search = "", city = "") => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: pagination.limit,
        search,
        city,
      };

      const response = await customersAPI.getAll(params);
      setCustomers(response.data.data);
      setPagination({
        ...pagination,
        page: response.data.page,
        total: response.data.total,
        totalPages: response.data.totalPages,
      });
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch customers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCustomers(1, searchTerm, cityFilter);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchCustomers(newPage, searchTerm, cityFilter);
    }
  };

  const handleDeleteCustomer = async (id) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      try {
        await customersAPI.delete(id);
        fetchCustomers(pagination.page, searchTerm, cityFilter);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to delete customer");
      }
    }
  };

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">Customers</h1>
        <Link to="/customers/new" className="btn btn-primary">
          Add New Customer
        </Link>
      </div>

      <div className="card">
        <form onSubmit={handleSearch} className="search-form">
          <div className="form-row">
            <div className="form-group">
              <input
                type="text"
                placeholder="Search by name or phone"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                placeholder="Filter by city"
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="form-input"
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Search
            </button>
          </div>
        </form>
      </div>

      {error && (
        <div className="card error-card">
          <p>{error}</p>
        </div>
      )}

      {loading ? (
        <div className="loading">Loading customers...</div>
      ) : (
        <>
          <CustomerList
            customers={customers}
            onDelete={handleDeleteCustomer}
            currentPage={pagination.page}
            itemsPerPage={pagination.limit}
          />

          {pagination.totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="btn"
              >
                Previous
              </button>

              <span>
                Page {pagination.page} of {pagination.totalPages}
              </span>

              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className="btn"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CustomerListPage;
