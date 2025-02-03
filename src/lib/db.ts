import mongoose from "mongoose";

// Define interface for the global mongoose object
declare global {
  var mongooseConnection: {
    conn: mongoose.Connection | null;
    promise: Promise<mongoose.Connection> | null;
  };
}

if (!global.mongooseConnection) {
  global.mongooseConnection = {
    conn: null,
    promise: null
  };
}

export async function dbConnect(): Promise<mongoose.Connection> {
  if (global.mongooseConnection.conn) {
    return global.mongooseConnection.conn; // Reuse existing connection
  } else {
    const connectionString = process.env.MONGO_URL;
    if (!connectionString) {
      throw new Error("MONGO_URL must be defined in environment variables.");
    }
    const opts = {
      autoIndex: true, // Note: Consider turning this off in production
      dbName: "stockquest"
    };
    if (!global.mongooseConnection.promise) {
      global.mongooseConnection.promise = mongoose
        .connect(connectionString, opts)
        .then((mongoose) => {
          return mongoose.connection;
        })
        .catch((error) => {
          console.error("Database connection failed", error);
          throw error; // Re-throw to handle it in the calling function
        });
    }
  }

  global.mongooseConnection.conn = await global.mongooseConnection.promise;
  return global.mongooseConnection.conn;
}
