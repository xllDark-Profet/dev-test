import Payment from "../models/payment.model.js";
import Loan from "../models/loan.model.js";
import User from "../models/user.model.js";

export const applyPayment = async (req, res) => {
  try {
    const userLoged = await User.findById(req.user.id);
    if (userLoged.rol != "client") {
      return res.status(404).json({
        message: "El cliente es el unico que puede realizar pagos",
      });
    }
    const loan = await Loan.findById(req.params.id).populate("payments");
    if (!loan) {
      return res.status(400).json({ message: "Prestamo no encontrado" });
    }
    const { amount_paid } = req.body;
    if (!amount_paid || amount_paid <= 0) {
      return res.status(400).json({ message: "El monto pagado no es válido" });
    }
    if (loan.state === "PAGADO") {
      return res.status(400).json({ message: "El prestamo ya esta pagado" });
    }
    const nextPayment = loan.payments.find(
      (payment) => payment.state === "PENDIENTE"
    );
    if (!nextPayment) {
      return res
        .status(400)
        .json({ message: "No hay pagos pendiente para este prestamo" });
    }
    const payment = await Payment.findById(nextPayment._id);
    if (amount_paid >= payment.amount) {
      payment.state = "PAGADO";
      await payment.save();
    } else {
      payment.amount -= amount_paid;
      await payment.save();
    }
    const allPaymentsPending = await Payment.find({
      loan: req.params.id,
      state: "PENDIENTE",
    });

    if (allPaymentsPending.length === 0) {
      loan.state = "PAGADO";
      await loan.save();
    }
    res.json({
      message: "Pago aplicado exitosamente",
      payment,
      loan,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error al generar el pago" });
  }
};

export const revertPayment = async (req, res) => {
  try {
    const userLoged = await User.findById(req.user.id);
    if (userLoged.rol != "client") {
      return res.status(404).json({
        message: "El cliente es el unico que puede realizar pagos",
      });
    }
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(400).json({ message: "Pago no encontrado" });
    }
    if (payment.state !== "PAGADO") {
      return res.status(400).json({ message: "El Pago aun esta pendiente" });
    }
    const loan = await Loan.findById(payment.loan._id);
    if (!loan) {
      return res.status(400).json({ message: "Prestamo no encontrado" });
    }
    payment.state = "PENDIENTE";
    await payment.save();
    loan.amount += payment.amount;
    await loan.save();
    const allPaymentsPending = await Payment.find({ loan: payment.loan._id, state: "PENDIENTE"});
    if(allPaymentsPending.length >0){
        loan.state = 'ACTIVO';
    } else{
        loan.state = 'PAGADO';
    }
    await loan.save();

    res.json({
        message: "Pago revertido exitosamente",
        payment,
        loan,
    });
  } catch (error) {
    return res.status(500).jaon({message: "Erro al revertir el pago"});
  }
};
