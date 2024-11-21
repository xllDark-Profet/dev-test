import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
  },
  expiration_date: {
    type: Date,
    required: true,
  },
  state: {
    type: String,
    enum: ["PENDIENTE", "PAGADO"],
    default: "PENDIENTE",
  },
  loan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Loan",
    required: true,
  },
});

export default mongoose.model("Payment", paymentSchema);
