import mongoose, { Document, Model, Types } from "mongoose";
import Company, { ICompany } from "./Company";

// interface for the Game document
export interface IGame extends Document {
  _id: Types.ObjectId;
  gameCode: string;
  status: string;
  company: ICompany;
  hostId: string;
  hasStarted: boolean;
}

// schema for game
const gameSchema = new mongoose.Schema<IGame>({
  gameCode: { type: String, required: true },
  status: {
    type: String,
    enum: ["NOT_STARTED", "STARTED", "ENDED"],
    required: true
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  hostId: { type: String, required: true },
  hasStarted: { type: Boolean, default: false }
});

// creating model or using existing schema
const Game: Model<IGame> =
  mongoose.models.Game || mongoose.model<IGame>("Game", gameSchema);

export default Game;
