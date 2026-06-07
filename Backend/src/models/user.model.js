const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: [true, 'username is required'], trim: true, minlength: 2 },
  email: { type: String, unique: true, required: [true, 'email is required'], trim: true, lowercase: true },
  password: { type: String, required: [true, 'password is required'], select: false },
  role: { type: String, enum: ['user', 'admin'], default: 'user' }
}, { timestamps: true });

const userModel = mongoose.model('User', userSchema);
module.exports = userModel;
