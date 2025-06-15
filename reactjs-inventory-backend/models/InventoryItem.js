const mongoose = require("mongoose");

const InventoryItemSchema = new mongoose.Schema({
  jobSiteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "JobSite",
  },
  item: { type: String, required: true },
  category: { type: String, required: true },
  quantity: { type: Number, required: true },
  description: String,
  notes: String,
});

module.exports = mongoose.model("InventoryItem", InventoryItemSchema);
