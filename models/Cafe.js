import mongoose from 'mongoose';

const cafeSchema = mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isActive: { type: Boolean, default: true },
  image: { type: String },
  slug: { type: String, unique: true }
}, { timestamps: true });

export default mongoose.model('Cafe', cafeSchema);
