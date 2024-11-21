import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import { createLoan } from "../controllers/loan.controller.js";

const router = Router();

router.post("/usuarios/:id/prestamos", authRequired, createLoan);

export default router;