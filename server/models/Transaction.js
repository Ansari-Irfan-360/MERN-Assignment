import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
  ID: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  sold: { type: Boolean, required: true },
  image: { type: String, required: true },
  dateOfSale: { type: Date, required: true },
});

const Transaction = mongoose.model('Transaction', TransactionSchema);

export default Transaction;
