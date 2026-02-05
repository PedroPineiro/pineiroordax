import dotenv from "dotenv";
import express from "express";
import { Resend } from "resend";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Leer .env desde la raíz del proyecto (2 niveles arriba)
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const router = express.Router();
console.log("RESEND_API_KEY:", process.env.RESEND_API_KEY);
const resend = new Resend(process.env.RESEND_API_KEY);

router.post("/", async (req, res) => {
  const { nombre, email, asunto, mensaje } = req.body;

  try {
    const response = await resend.emails.send({
      from: "Contacto <onboarding@resend.dev>",
      to: process.env.CONTACT_EMAIL,
      subject: asunto || `Nuevo mensaje de ${nombre}`,
      html: `
      <h2>Nuevo mensaje desde el formulario</h2>
      <p><strong>Nombre:</strong> ${nombre}</p>
      <p><strong>Asunto:</strong> ${asunto}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Mensaje:</strong></p>
      <p>${mensaje}</p>
      `,
    });

    res.json({ ok: true, id: response.id });
  } catch (error) {
    console.log("Error enviando email:", error);
    res.status(500).json({ ok: false, error: "No se pudo enviar el email" });
  }
});

export default router;
