import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import authRoutes from './routes/auth.routes.js';
import offerRoutes from './routes/offer.routes.js';
import loanRoutes from './routes/loan.routes.js';
import paymentRoutes from './routes/payment.routes.js';

const app = express()

app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser())
app.use(authRoutes);
app.use(offerRoutes);
app.use(loanRoutes);
app.use(paymentRoutes);

export default app;