import mongoose, { Schema } from "mongoose";

const ContactSchema = new Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },

    // open / in_progress / closed (closed = archived)
    status: {
      type: String,
      enum: ["open", "closed"],
      default: "open",
    },
    adminNote: { type: String, default: "" },

    // when status becomes "closed", we set this
    closedAt: { type: Date, default: null },
  },
  { timestamps: true }
);


// 30 days * 24h * 60m * 60s = 2 592 000 seconds
ContactSchema.index({ closedAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 30 });

export type ContactDoc = mongoose.InferSchemaType<typeof ContactSchema>;

export default (mongoose.models.Contact as mongoose.Model<ContactDoc>) ||
  mongoose.model<ContactDoc>("Contact", ContactSchema);
