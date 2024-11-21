import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import {getOffers, getOffer, createOffer, updateOffer, deleteOffer } from "../controllers/offer.controller.js";

const router = Router();

router.get("/ofertas", authRequired, getOffers);
router.get("/ofertas/:id", authRequired, getOffer);
router.post("/usuarios/:id/ofertas", authRequired, createOffer);
router.put("/ofertas/:id", authRequired, updateOffer);
router.delete("/ofertas/:id", authRequired, deleteOffer);

export default router;