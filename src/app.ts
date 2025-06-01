import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { NotFoundError } from "./errors";
import routes from "./routes";
import { StatusCode } from "./utils";

mongoose.connect("mongodb://localhost:27017/mestodb");

const PORT = process.env.PORT || 3000;
const app = express();

app.use((req: Request, res: Response, next: NextFunction) => {
  // @ts-expect-error
  req.user = {
    _id: "683c2711f588f756a662f7e9"
  };

  next();
}); 


app.use(express.json());
app.use('/', routes);

app.use("*", (req: Request, res: Response, next: NextFunction) => {
  next(new NotFoundError("Ресурс не найден"));
});

app.use((err: Error & { statusCode?: number }, req: Request, res: Response, next: NextFunction) => {
  const { statusCode = StatusCode.SERVER_ERROR, message } = err;
  
  res.status(statusCode).send({
    message: statusCode === StatusCode.SERVER_ERROR
      ? 'На сервере произошла ошибка'
      : message,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});