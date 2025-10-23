import express from "express";
import fetch from "node-fetch";

const router = express.Router();

// Proxy para obtener imágenes externas y evitar el error ORB
router.get("/proxy-image", async (req, res) => {
  const { url } = req.query;

  if (!url) return res.status(400).send("Falta el parámetro 'url'");

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Error al obtener la imagen");
    }

    const contentType = response.headers.get("content-type");
    const buffer = await response.arrayBuffer();

    res.set("Content-Type", contentType);
    res.send(Buffer.from(buffer));
  } catch (err) {
    console.error("Error al cargar imagen:", err.message);
    res.status(500).sendFile("assets/default-player.png", { root: "./" });
  }
});

export default router;
