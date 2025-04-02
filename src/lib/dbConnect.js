import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined in .env.local");
}

// Global Mongoose connection cache to prevent multiple connections
let cached = global.mongoose || { conn: null, promise: null };

const dbConnect = async () => {
  if (cached.conn) {
    console.log("MongoDB already connected. ✅");
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then((mongoose) => mongoose);
  }

  try {
    cached.conn = await cached.promise;
    console.log("MongoDB Connected Successfully ✅");
    return cached.conn;
  } catch (error) {
    console.error("MongoDB Connection Error ❌:", error);
    cached.promise = null; // Reset the promise in case of failure
    throw new Error("MongoDB Connection Failed");
  }
};

// Store the cache globally in development to avoid multiple connections
if (process.env.NODE_ENV !== "production") {
  global.mongoose = cached;
}

export default dbConnect;
