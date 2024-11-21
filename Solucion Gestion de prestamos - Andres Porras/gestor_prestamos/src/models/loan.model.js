import mongoose from "mongoose";

const loanShema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
  },
  term: {
    type: Number,
    required: true,
  },
  interest_rate: {
    type: Number,
    required: true,
  },
  state: {
    type: String,
    enum: ["ACTIVO", "PAGADO"],
    default: "ACTIVO",
    requiered: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  offer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Offer",
    requiered: true,
  },
  payments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
    },
  ],
});

export default mongoose.model("Loan", loanShema);
