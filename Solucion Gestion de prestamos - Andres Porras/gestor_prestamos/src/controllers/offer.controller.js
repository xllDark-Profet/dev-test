import Offer from "../models/offer.model.js";
import User from "../models/user.model.js";

export const getOffers = async (req, res) => {
  const offers = await Offer.find();
  res.json(offers);
};

export const createOffer = async (req, res) => {
  try {
    const userLoged = await User.findById(req.user.id);
    if (userLoged.rol != "admin") {
      return res.status(404).json({
        message: "El administrador es el unico que puede agregar ofertas",
      });
    }
    const user_client_offer = await User.findById(req.params.id);
    if (user_client_offer.rol != "client") {
      return res
        .status(404)
        .json({
          message:
            "No se pueden agregar ofertas a un usuario que no sea un cliente",
        });
    }
    const { amount, term, interest_rate } = req.body;
    if (!amount || !term || !interest_rate) {
      return res.status(400).json({
        message:
          "Todos los campos (amount, term, interest_rate) son requeridos",
      });
    }
    const newOffer = new Offer({
      amount,
      term,
      interest_rate,
      user: user_client_offer.id,
    });
    const savedOffer = await newOffer.save();
    res.json({
      message: "Oferta creada exitosamente",
      offer_id: savedOffer.id,
      user_id: savedOffer.user,
      user_name: user_client_offer.username,
      amount: savedOffer.amount,
      term: savedOffer.term,
      interest_rate: savedOffer.interest_rate,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error al crear la oferta" });
  }
};

export const getOffer = async (req, res) => {
  const offer = await Offer.findById(req.params.id);
  if (!offer) {
    return res.status(404).json({ message: "Oferta no encontrada" });
  }
  res.json(offer);
};

export const updateOffer = async (req, res) => {
  const offer = await Offer.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!offer) {
    return res.status(404).json({ message: "Oferta no encontrada" });
  }
  res.json(offer);
};

export const deleteOffer = async (req, res) => {
  const offer = await Offer.findByIdAndDelete(req.params.id);
  if (!offer) {
    return res.status(404).json({ message: "Oferta no encontrada" });
  }
  res.json(offer);
};
