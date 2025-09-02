const express = require("express");
const router = express.Router();
const addressController = require("../controllers/addressController");

router.post("/:id/addresses", addressController.createAddress);
router.get("/:id/addresses", addressController.getAddresses);
router.put("/:addressId", addressController.updateAddress);
router.delete("/:addressId", addressController.deleteAddress);

module.exports = router;
