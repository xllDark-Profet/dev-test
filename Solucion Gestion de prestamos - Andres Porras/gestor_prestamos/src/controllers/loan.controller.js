import Loan from "../models/loan.model.js";
import Offer from "../models/offer.model.js";
import Payment from "../models/payment.model.js";
import User from "../models/user.model.js";

import moment from "moment";

export const createLoan = async (req, res) => {
  try {
    const userLoged = await User.findById(req.user.id);
    if (userLoged.rol != "client") {
      return res.status(404).json({
        message: "El cliente es el unico que puede generar los prestamos",
      });
    }
    const user_client_offer = await User.findById(req.params.id);
    if (user_client_offer.rol != "client") {
      return res
        .status(404)
        .json({
          message: "No se pueden agregar prestamos un usuario administrador",
        });
    }
    const offerId = req.body.offerid;
    const offer = await Offer.findById(offerId);
    if (!offer) {
      return res.status(404).json({ message: "Oferta no encontrada" });
    }
    const { amount, term, interest_rate } = offer;
    const newLoan = new Loan({
      amount,
      term,
      interest_rate,
      user: user_client_offer._id,
      offer: offerId,
    });
    const savedLoan = await newLoan.save();
    const payments = [];
    const paymentAmount = (amount + (amount * interest_rate) / 100) / term;
    for (let i = 0; i < term; i++) {
      const expirationDate = moment().add(i, "months").toDate();
      const newPayment = new Payment({
        amount: paymentAmount,
        expiration_date: expirationDate,
        loan: savedLoan._id,
      });
      const savedPayment = await newPayment.save();
      payments.push(savedPayment._id);
      savedLoan.payments.push(savedPayment._id);
    }
    await savedLoan.save();
    res.json({
      message: "Prestamo creado exitosamente",
      loan: savedLoan,
      payments,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating loan", error });
  }
};
