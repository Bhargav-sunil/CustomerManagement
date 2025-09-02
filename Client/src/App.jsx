import React from "react";
import { Routes, Route } from "react-router-dom";
import CustomerListPage from "./Pages/CustomerListPage/CustomerListPage";
import CustomerDetailPage from "./Pages/CustomerDetailPage/CustomerDetailPage";
import CustomerFormPage from "./Pages/CustomerFormPage/CustomerFormPage";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<CustomerListPage />} />
        <Route path="/customers" element={<CustomerListPage />} />
        <Route path="/customers/new" element={<CustomerFormPage />} />
        <Route path="/customers/:id" element={<CustomerDetailPage />} />
        <Route path="/customers/:id/edit" element={<CustomerFormPage />} />
      </Routes>
    </div>
  );
}

export default App;
