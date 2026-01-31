import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import aiRoutes from "./routes/aiRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get('/',(req,res)=>res.send('Server is Running!'))

app.use("/api/ai", aiRoutes);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
