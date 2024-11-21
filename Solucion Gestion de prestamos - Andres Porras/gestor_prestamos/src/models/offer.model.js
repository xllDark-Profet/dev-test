import mongoose from "mongoose";

const offerSchema = new mongoose.Schema({
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
  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
});

export default mongoose.model("Offer", offerSchema);
