const mongoose = require("mongoose");
const redis = require("redis");
const util = require("util");

const redisClient = redis.createClient();

const getAsync = util.promisify(redisClient.get).bind(redisClient);
const setAsync = util.promisify(redisClient.set).bind(redisClient);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Define a function to cache user data in Redis
userSchema.statics.findByEmail = async function (email) {
  const cachedUser = await getAsync(email);
  if (cachedUser) {
    console.log("Data fetched from Redis cache");
    return JSON.parse(cachedUser);
  }

  const user = await this.findOne({ email });
  if (user) {
    console.log("Data fetched from MongoDB and stored in Redis cache");
    await setAsync(email, JSON.stringify(user));
  }
  return user;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
