import connectDB from "./db/index.js";
import dotenv from "dotenv";
import express from "express";
dotenv.config({
  path: "./env",
});
const app = express();

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 3000, () => {
      console.log(`app is listening on port: ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MONGODB connection failed", err);
  });

// (async () => {
//   try {
//     await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
//     app.on("error", (error) => {
//       console.log("ERR: ", error);
//       throw error;
//     });
//     app.listen(process.env.PORT, () => {
//       console.log(`app is listening on port: ${process.env.PORT}`);
//     });
//   } catch (error) {
//     console.log("Error: ", error);
//     throw err;
//   }
// })();
