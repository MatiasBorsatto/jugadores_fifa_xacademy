import jugadorService from "../services/jugador.service.js";

class JugadorController {
  async crear(req, res) {
    try {
      const datosJugador = req.body;
      const jugador = await jugadorService.crear(datosJugador);

      res.status(201).json({
        mensaje: "Se guardó el jugador correctamente",
        jugador,
      });
    } catch (error) {
      console.error("Error guardando jugador:", error);
      res.status(400).json({ error: error.message });
    }
  }

  async obtenerTodos(req, res) {
    try {
      // Obtener parámetros de filtro y paginación
      const { nombre, club, posicion, pagina = 1, porPagina = 20 } = req.query;

      const opciones = {
        nombre,
        club,
        posicion,
        pagina: parseInt(pagina),
        porPagina: parseInt(porPagina),
      };

      const resultado = await jugadorService.obtenerTodos(opciones);

      res.status(200).json({
        mensaje: "Se obtuvieron los jugadores correctamente",
        jugador: resultado.jugadores,
        total: resultado.total,
        pagina: resultado.pagina,
        porPagina: resultado.porPagina,
      });
    } catch (error) {
      console.error("Error obteniendo los jugadores:", error);
      res.status(400).json({ error: error.message });
    }
  }

  async obtenerPorId(req, res) {
    try {
      const { id } = req.params;
      const jugador = await jugadorService.obtenerPorId(id);

      if (!jugador) {
        return res.status(404).json({ error: "Jugador no encontrado" });
      }

      res.status(200).json({
        mensaje: "Se obtuvo el jugador correctamente",
        jugador,
      });
    } catch (error) {
      console.error("Error al obtener jugador:", error);
      res.status(400).json({ error: error.message });
    }
  }

  async actualizarJugador(req, res) {
    const { id } = req.params;

    try {
      const jugadorId = await jugadorService.obtenerPorId(id);
      if (!jugadorId) {
        return res.status(404).json({ error: "Jugador no encontrado" });
      }

      const updated = await jugadorService.actualizar(id, req.body);

      res.status(200).json({
        mensaje: "Jugador actualizado correctamente",
        jugador: updated,
      });
    } catch (error) {
      console.error("Error actualizando jugador:", error);
      res.status(500).json({ error: error.message });
    }
  }

  async obtenerImagenes(req, res) {
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
  }
}

export default new JugadorController();
