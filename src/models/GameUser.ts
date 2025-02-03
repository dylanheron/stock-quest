import mongoose, { Document, Model } from "mongoose";
import Game from "./Game";

// interface for the Game User
interface IGameUser extends Document {
  userId: string;
  game: typeof Game;
  profit: number;
}

// schema for game user
const gameUserSchema = new mongoose.Schema<IGameUser>({
  userId: { type: String, required: true },
  game: { type: mongoose.Schema.Types.ObjectId, ref: "Game", required: true },
  profit: { type: Number, default: 1000 }
});

// creating model or using existing schema
const GameUser: Model<IGameUser> =
  mongoose.models.GameUser ||
  mongoose.model<IGameUser>("GameUser", gameUserSchema);

export default GameUser;
