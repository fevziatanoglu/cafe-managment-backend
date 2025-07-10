import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
  username: { type: String, required: true, unique: function() {return this.role !== 'admin';} },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  refreshToken: { type: String },
  role: { 
    type: String, 
    enum: ['admin', 'waiter', 'kitchen'] , default: 'admin', 
    required: true 
  },
  adminId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: function() { return this.role !== 'admin'; },
    default: null
  }
}, { timestamps: true });

// Unique admin-user username combination
userSchema.index({ adminId: 1, username: 1 }, { unique: true });

export default mongoose.model('User', userSchema);
