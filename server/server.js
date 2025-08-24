import express from 'express';
import cors from 'cors';
import 'dotenv/config'
import { serve } from 'inngest/express';
import connectDB from './config/db.js';
import {inngest, functions} from './inngest/inngest.js';
import {clerkMiddleware} from '@clerk/express'
import userRouter from './routes/user.routes.js';
import postRouter from './routes/post.routes.js';

const app = express();
await connectDB();

app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

app.get('/', (req, res) => {
  res.send('server working great!!!!');
});

app.use('/api/inngest', serve({client: inngest, functions}));
app.use('/api/users', userRouter);
app.use('/api/post', postRouter);

app.listen(process.env.PORT || 4000, () => {
  console.log(`Server is running on port ${process.env.PORT || 4000}`);
});

