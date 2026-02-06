import 'dotenv/config';
import express from "express";
import cors from "cors";
import { clerkMiddleware, requireAuth } from "@clerk/express";
import aiRouter from './routes/aiRoutes.js';

const app = express();


app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());


app.get('/',(req,res)=>res.send('Server is Running!'))

app.use(requireAuth());

app.use("/api/ai", aiRouter);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
