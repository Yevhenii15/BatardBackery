import mongoose, { Schema } from "mongoose";

const ContactInfoSchema = new Schema(
  {
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    openingHours: { type: String, default: "" },
    address: { type: String, required: true },

    logoLight: { type: String, default: "" },
    logoDark: { type: String, default: "" },

    cvr: { type: String, default: "" },
  },
  { timestamps: true }
);

export type ContactInfoDoc = mongoose.InferSchemaType<typeof ContactInfoSchema>;

export default (mongoose.models
  .ContactInfo as mongoose.Model<ContactInfoDoc>) ||
  mongoose.model<ContactInfoDoc>("ContactInfo", ContactInfoSchema);
