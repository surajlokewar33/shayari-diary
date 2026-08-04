import mongoose, { Schema, models, model } from 'mongoose';

const AdminSchema = new Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true }
);

const AdminModel: mongoose.Model<any> = models.Admin || model('Admin', AdminSchema);
export default AdminModel;
