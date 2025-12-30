import mongoose from 'mongoose';

const MediaAssetSchema = new mongoose.Schema({
  url: { type: String, required: true, unique: true },
  key: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: {
    type: String,
    enum: ['pending', 'active'],
    default: 'pending'
  },
}, { timestamps: true });

const MediaAsset = mongoose.model('MediaAsset', MediaAssetSchema);
export default MediaAsset;