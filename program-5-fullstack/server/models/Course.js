const mongoose = require('mongoose');

const CATEGORIES = ['Web Development', 'Computer Science', 'Data Science', 'Design', 'Business'];

const courseSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'name is required'], trim: true, minlength: [3, 'name must be at least 3 characters'] },
    description: { type: String, required: [true, 'description is required'], trim: true, minlength: [10, 'description must be at least 10 characters'] },
    category: { type: String, required: [true, 'category is required'], enum: { values: CATEGORIES, message: 'Invalid category' } },
    price: { type: Number, required: [true, 'price is required'], min: [0, 'price cannot be negative'] },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // reference to the user who made it
  },
  { timestamps: true }
);

module.exports = mongoose.model('Course', courseSchema);
