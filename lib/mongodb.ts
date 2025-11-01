import mongoose from "mongoose";

//todo: define the connection cache type
type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

// todo: extend global object to include our mongoose cache
declare global {
  var mongoose: MongooseCache | undefined;
}

const mongodb_uri = process.env.MONGODB_URI;

// todo: validate MongoDB available or !
if (!mongodb_uri) {
  throw new Error("mongodb uri is not available in the env or is not valid");
}

// todo: initialize  the cache on global object to persist across hot reloads in development.
const cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

// todo: connect the mongoDB using mongoose
async function connectDB(): Promise<typeof mongoose> {
  // return if existing connection is available
  if (cached.conn) {
    return cached.conn;
  }

  // todo: return existing connection promise if one is in progress
  if (!cached.promise) {
    const options = {
      bufferCommands: false,
    };

    // todo: create a connection
    cached.promise = mongoose
      .connect(mongodb_uri!, options)
      .then((mongoose) => {
        return mongoose;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    // reset promise on error to allow retry
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}

export default connectDB();
