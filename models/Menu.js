import mongoose from 'mongoose';

const menuSchema = mongoose.Schema({
  name: { type: String, required: true }, 
  description: { type: String },
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }], 
  isActive: { type: Boolean, default: true },
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

export default mongoose.model('Menu', menuSchema);
