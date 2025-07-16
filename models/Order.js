import mongoose from 'mongoose';

const orderSchema = mongoose.Schema({
  tableId: { type: mongoose.Schema.Types.ObjectId, ref: 'Table', required: true }, 
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }, 
    quantity: { type: Number, required: true, default: 1 }                        
  }],
  status: { type: String, enum: ['pending', 'preparing', 'served', 'paid'], default: 'pending' }, 
  total: { type: Number },                   
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }    
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);
