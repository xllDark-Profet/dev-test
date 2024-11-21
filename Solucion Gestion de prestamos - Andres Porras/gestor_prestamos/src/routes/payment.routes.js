import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import {
  applyPayment,
  revertPayment,
} from "../controllers/payment.controller.js";

const router = Router();

router.post("/prestamos/:id/pagos", authRequired, applyPayment);
router.post("/pagos/:id/revertir", authRequired, revertPayment);

export default router;
