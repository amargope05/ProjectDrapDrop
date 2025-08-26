const mongoose = require("mongoose");

const elementSchema = new mongoose.Schema({
  id: String,
  type: String,       
  left: Number,
  top: Number,
  content: String,     
  label: String,        
  src: String,          
  styles: Object,       
  width: Number,        
  height: Number      
});

const pageLayoutSchema = new mongoose.Schema({
  name: { type: String, required: true },
  background: { type: String, default: "#ffffff" },
  elements: [elementSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("PageLayout", pageLayoutSchema);
