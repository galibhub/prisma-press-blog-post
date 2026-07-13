import express, { Application, Response,Request } from "express";
import cors from "cors"
import config from "./config";
import cookieParser from "cookie-parser";


const app: Application = express();

//middleware
app.use(cors({
  origin: config.app_url,
  credentials:true
}))

app.use(express.json())
app.use(express.urlencoded({extended:true}));
app.use(cookieParser())


// routes
app.get("/", (req: Request, res: Response) => {
  res.send("Hello World");
});

export default app;
