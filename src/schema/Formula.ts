import mongoose, { Schema, Document } from "mongoose";

export interface Formula extends Document {
  configuration: {
    adyenWebVersion: string;
    checkoutAPIVersion: {
      paymentMethods: string;
      payments: string;
      paymentsDetails: string;
      sessions: string;
    };
    checkoutConfiguration: string;
    request: {
      paymentMethods: Record<string, any>; // Allow any key-value pair of mixed type
      payments: Record<string, any>; // Allow any key-value pair of mixed type
      paymentsDetails: Record<string, any>;
      sessions: Record<string, any>; // Allow any key-value pair of mixed type
    };
    style: Record<string, any>;
    txVariantConfiguration: string;
    isRedirect: boolean;
  };
  title?: string;
  public?: boolean;
  description?: string;
  integrationType: "advance" | "sessions";
  txVariant: string;
  icon: string;
  builtBy: string;
  createdBy?: mongoose.Types.ObjectId;
}

const FormulaSchema: Schema = new Schema(
  {
    configuration: {
      adyenWebVersion: { type: String, required: true },
      checkoutAPIVersion: {
        paymentMethods: { type: String, required: true },
        payments: { type: String, required: true },
        paymentsDetails: { type: String, required: true },
        sessions: { type: String, required: true },
      },
      checkoutConfiguration: { type: String, required: true },
      request: {
        paymentMethods: { type: Schema.Types.Mixed, required: true }, // Allow any key-value pair of mixed type
        payments: { type: Schema.Types.Mixed, required: true },
        paymentsDetails: { type: Schema.Types.Mixed, required: true },
        sessions: { type: Schema.Types.Mixed, required: true },
      },
      style: {
        type: String,
        required: function (this: Formula) {
          return typeof this.configuration.style !== "string";
        },
      },
      txVariantConfiguration: { type: String, required: false },
      isRedirect: { type: Boolean, required: true },
    },
    title: { type: String, required: false },
    description: { type: String, required: false },
    integrationType: {
      type: String,
      enum: ["advance", "sessions"],
      required: true,
    },
    txVariant: { type: String, required: true },
    icon: { type: String, required: true, default: "Calculator" },
    builtBy: { type: String, required: true, default: "Adyen" },
    public: { type: Boolean, required: false, default: false },
    createdBy: { type: Schema.Types.ObjectId, required: false },
  },
  { timestamps: true, minimize: false }
);

FormulaSchema.index({ title: "text" });

export default mongoose.models.Formula ||
  mongoose.model<Formula>("Formula", FormulaSchema);
