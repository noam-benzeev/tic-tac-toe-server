import express from 'express';
import cors from 'cors';
import { Api } from './modules/api';
import { DB } from './modules/db';
import { Logger } from './modules/logger/logger';

const PORT: number = 5000;
const ORIGIN_URL: string = `http://localhost:${PORT}`;
const app: express.Application = express();
const corsOptions = {origin: ORIGIN_URL};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

Logger.init();
DB.init();
Api.init(app);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});