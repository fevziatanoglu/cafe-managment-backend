import mongoose from 'mongoose';

const tableSchema = mongoose.Schema({
  number: { type: Number, required: true },           
  status: { type: String, enum: ['empty', 'occupied', 'reserved'], default: 'empty' }, 
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } 
}, { timestamps: true });

export default mongoose.model('Table', tableSchema);
