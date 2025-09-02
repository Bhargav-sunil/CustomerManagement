const db = require("../config/db");

// ✅ Validate customer
function validateCustomer(data) {
  if (!data.first_name || !data.last_name || !data.phone_number) {
    return "First name, last name, and phone number are required.";
  }
  if (!/^\d{10}$/.test(data.phone_number)) {
    return "Phone number must be 10 digits.";
  }
  return null;
}

//Create Customer Controller
exports.createCustomer = (req, res) => {
  const error = validateCustomer(req.body);
  if (error) return res.status(400).json({ error });

  const { first_name, last_name, phone_number } = req.body;
  const sql = `INSERT INTO customers (first_name, last_name, phone_number) VALUES (?, ?, ?)`;

  db.run(sql, [first_name, last_name, phone_number], function (err) {
    if (err) {
      if (err.message.includes("UNIQUE constraint failed")) {
        return res.status(400).json({ error: "Phone number already exists." });
      }
      return res.status(500).json({ error: "Number already Exists" });
    }
    res
      .status(201)
      .json({ id: this.lastID, first_name, last_name, phone_number });
  });
};

// Get Customers By search, filter, pagination Controller
exports.getCustomers = (req, res) => {
  let {
    page = 1,
    limit = 10,
    search = "",
    city = "",
    sort = "id",
    order = "ASC",
  } = req.query;

  page = parseInt(page);
  limit = parseInt(limit);
  const offset = (page - 1) * limit;

  const validSortFields = ["id", "first_name", "last_name", "phone_number"];
  if (!validSortFields.includes(sort)) sort = "id";
  order = order.toUpperCase() === "DESC" ? "DESC" : "ASC";

  let conditions = [];
  let params = [];

  if (search) {
    conditions.push(
      "(first_name LIKE ? OR last_name LIKE ? OR phone_number LIKE ?)"
    );
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  if (city) {
    conditions.push(
      "id IN (SELECT customer_id FROM addresses WHERE city LIKE ?)"
    );
    params.push(`%${city}%`);
  }

  const whereClause = conditions.length
    ? `WHERE ${conditions.join(" AND ")}`
    : "";

  const sql = `
    SELECT * FROM customers
    ${whereClause}
    ORDER BY ${sort} ${order}
    LIMIT ? OFFSET ?
  `;
  params.push(limit, offset);

  db.all(sql, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    const countSql = `SELECT COUNT(*) as total FROM customers ${whereClause}`;
    db.get(countSql, params.slice(0, -2), (err, countRow) => {
      if (err) return res.status(500).json({ error: err.message });

      res.json({
        page,
        limit,
        total: countRow.total,
        totalPages: Math.ceil(countRow.total / limit),
        data: rows,
      });
    });
  });
};

// Get Customer by ID Controller
exports.getCustomerById = (req, res) => {
  db.get(
    `SELECT * FROM customers WHERE id = ?`,
    [req.params.id],
    (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!row) return res.status(404).json({ error: "Customer not found" });
      res.json(row);
    }
  );
};

//Update Customer Controller
exports.updateCustomer = (req, res) => {
  const error = validateCustomer(req.body);
  if (error) return res.status(400).json({ error });

  const { first_name, last_name, phone_number } = req.body;
  db.run(
    `UPDATE customers SET first_name = ?, last_name = ?, phone_number = ? WHERE id = ?`,
    [first_name, last_name, phone_number, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0)
        return res.status(404).json({ error: "Customer not found" });
      res.json({ message: "Customer updated successfully" });
    }
  );
};

//Delete Customer Controller
exports.deleteCustomer = (req, res) => {
  db.run(`DELETE FROM customers WHERE id = ?`, [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0)
      return res.status(404).json({ error: "Customer not found" });
    res.json({ message: "Customer deleted successfully" });
  });
};
