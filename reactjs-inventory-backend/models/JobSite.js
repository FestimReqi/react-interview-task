const mongoose = require("mongoose");

const JobSiteSchema = new mongoose.Schema({
  name: { type: String, required: true },
  status: { type: String, required: true },
});

module.exports = mongoose.model("JobSite", JobSiteSchema);
