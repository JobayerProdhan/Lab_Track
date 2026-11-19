import dotenv from "dotenv";
import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { connectDB } from "./config/db.js";
import equipmentRoute from "./routes/equipment.route.js";
const app: Application = express();
dotenv.config();

// This is our MiddleWare
app.use(express.json());
app.use("/api/v1/equipment", equipmentRoute);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Wellcome to LabTrack API",
  });
});

const port = process.env.PORT;

const startServer = async () => {
  await connectDB();

  app.listen(port, () => {
    console.log(
      "Hukka Huya dum dharakkah kaj hoise bro.....SERVER is ON . server er port holo: ",
      port,
    );
  });
};

startServer();



