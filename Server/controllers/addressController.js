const db = require("../config/db");

// Validate address Controller
function validateAddress(data) {
  if (!data.address_details || !data.city || !data.state || !data.pin_code) {
    return "All address fields are required.";
  }
  if (!/^\d{6}$/.test(data.pin_code)) {
    return "Pin code must be 6 digits.";
  }
  return null;
}

// Add Address Controller
exports.createAddress = (req, res) => {
  const error = validateAddress(req.body);
  if (error) return res.status(400).json({ error });

  const { address_details, city, state, pin_code } = req.body;
  const sql = `INSERT INTO addresses (customer_id, address_details, city, state, pin_code) VALUES (?, ?, ?, ?, ?)`;

  db.run(
    sql,
    [req.params.id, address_details, city, state, pin_code],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({
        id: this.lastID,
        customer_id: req.params.id,
        address_details,
        city,
        state,
        pin_code,
      });
    }
  );
};

// Get All Addresses of Customer Controller
exports.getAddresses = (req, res) => {
  db.all(
    `SELECT * FROM addresses WHERE customer_id = ?`,
    [req.params.id],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
};

// Update Address Controller
exports.updateAddress = (req, res) => {
  const error = validateAddress(req.body);
  if (error) return res.status(400).json({ error });

  const { address_details, city, state, pin_code } = req.body;
  db.run(
    `UPDATE addresses SET address_details = ?, city = ?, state = ?, pin_code = ? WHERE id = ?`,
    [address_details, city, state, pin_code, req.params.addressId],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0)
        return res.status(404).json({ error: "Address not found" });
      res.json({ message: "Address updated successfully" });
    }
  );
};

// Delete Address Controller
exports.deleteAddress = (req, res) => {
  db.run(
    `DELETE FROM addresses WHERE id = ?`,
    [req.params.addressId],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0)
        return res.status(404).json({ error: "Address not found" });
      res.json({ message: "Address deleted successfully" });
    }
  );
};
