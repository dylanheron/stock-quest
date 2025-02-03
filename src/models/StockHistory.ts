import mongoose, { Document, Model, Schema } from "mongoose";
import Company, { ICompany } from "./Company";

interface IStockData {
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  adjusted_close: number;
  volume: number;
}

export interface IStockHistory extends Document {
  company: ICompany; // Reference to the Mongoose model (for type checking)
  data: IStockData[];
}

const stockDataSchema = new Schema<IStockData>(
  {
    date: { type: Date, required: true },
    open: { type: Number, required: true },
    high: { type: Number, required: true },
    low: { type: Number, required: true },
    close: { type: Number, required: true },
    adjusted_close: { type: Number, required: true },
    volume: { type: Number, required: true }
  },
  { _id: false }
); // No need for _id in each stock data entry

const stockHistorySchema = new Schema<IStockHistory>({
  company: { type: Schema.Types.ObjectId, required: true }, // Refers to Company model
  data: [stockDataSchema] // Array of stock data
});

const StockHistory: Model<IStockHistory> =
  mongoose.models.StockHistory ||
  mongoose.model<IStockHistory>("StockHistory", stockHistorySchema);

export default StockHistory;
