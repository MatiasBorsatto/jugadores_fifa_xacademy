import Jugador from "../models/jugador.model.js";
import { Op } from "sequelize";

class JugadorService {
  // Método para obtener datos con filtros y paginación
  async obtenerTodos(opciones = {}) {
    const { nombre, club, posicion, pagina = 1, porPagina = 20 } = opciones;

    // Construir condiciones de filtro
    const where = {};

    if (nombre) {
      where.long_name = {
        [Op.like]: `%${nombre}%`,
      };
    }

    if (club) {
      where.club_name = {
        [Op.like]: `%${club}%`,
      };
    }

    if (posicion) {
      where.player_positions = {
        [Op.like]: `%${posicion}%`,
      };
    }

    // Calcular offset para paginación
    const offset = (pagina - 1) * porPagina;

    // Obtener jugadores con filtros y paginación
    const { count, rows } = await Jugador.findAndCountAll({
      where,
      limit: porPagina,
      offset: offset,
      order: [["overall", "DESC"]], // Ordenar por overall descendente
    });

    return {
      jugadores: rows,
      total: count,
      pagina: pagina,
      porPagina: porPagina,
    };
  }

  // Método para obtener datos (Uno en específico)
  async obtenerPorId(id) {
    return await Jugador.findByPk(id);
  }

  // Métodos para crear
  async crear(datosJugador) {
    return await Jugador.create(datosJugador);
  }

  async actualizar(jugadorId, datos) {
    const jugador = await Jugador.findByPk(jugadorId);
    if (!jugador) throw new Error("Jugador no encontrado");
    return await jugador.update(datos);
  }
}

export default new JugadorService();
