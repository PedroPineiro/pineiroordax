import { login, verificarToken, soloAdmin } from "./authController.js";
import express from "express";

const router = express.Router();

router.get("/modelos", verificarToken, soloAdmin, (req, res) => {
    res.json({ message: `Hola ${req.user.dni}, estas autenticado` });
});

router.get("/clientes", verificarToken, soloAdmin, (req, res) => {
  res.json({ message: `Hola ${req.user.dni}, estas autenticado` });
});

router.get("/ventas", verificarToken, soloAdmin, (req, res) => {
  res.json({ message: `Hola ${req.user.dni}, estas autenticado` });
});

router.get("/noticias", verificarToken, soloAdmin, (req, res) => {
  res.json({ message: `Hola ${req.user.dni}, estas autenticado` });
});

router.get("/check-admin", verificarToken, soloAdmin, (req, res) => {
  res.json({ message: `Hola ${req.user.dni}, estas autenticado` });
});





router.post("/login", login);

export default router;
