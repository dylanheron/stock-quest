import mongoose, { Document, Model } from "mongoose";

// interface for the Company
export interface ICompany extends Document {
  name: string;
  symbol: string;
  description: string;
}

// schema for company
const companySchema = new mongoose.Schema<ICompany>({
  name: { type: String, required: true },
  symbol: { type: String, required: true },
  description: { type: String, required: true }
});

// creating model or using existing schema
const Company: Model<ICompany> =
  mongoose.models.Company || mongoose.model<ICompany>("Company", companySchema);

export default Company;
