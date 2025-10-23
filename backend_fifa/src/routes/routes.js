import express from "express";
import verificarLogin from "../middleware/verificarLogin.js";
import jugadorController from "../controllers/jugador.controller.js";
import usuarioController from "../controllers/usuario.controller.js";
import {
  manejarErrores,
  filtrarCamposPermitidos,
} from "../middleware/manejarErrores.js";
import { body, param, validationResult } from "express-validator";

const ALLOWED_FIELDS = [
  "player_id",
  "player_url",
  "fifa_version",
  "fifa_update",
  "fifa_update_date",
  "short_name",
  "long_name",
  "player_positions",
  "overall",
  "potential",
  "value_eur",
  "wage_eur",
  "age",
  "dob",
  "height_cm",
  "weight_kg",
  "league_id",
  "league_name",
  "league_level",
  "club_team_id",
  "club_name",
  "club_position",
  "club_jersey_number",
  "club_loaned_from",
  "club_joined_date",
  "club_contract_valid_until_year",
  "nationality_id",
  "nationality_name",
  "nation_team_id",
  "nation_position",
  "nation_jersey_number",
  "preferred_foot",
  "weak_foot",
  "skill_moves",
  "international_reputation",
  "work_rate",
  "body_type",
  "real_face",
  "release_clause_eur",
  "player_tags",
  "player_traits",
  "pace",
  "shooting",
  "passing",
  "dribbling",
  "defending",
  "physic",
  "attacking_crossing",
  "attacking_finishing",
  "attacking_heading_accuracy",
  "attacking_short_passing",
  "attacking_volleys",
  "skill_dribbling",
  "skill_curve",
  "skill_fk_accuracy",
  "skill_long_passing",
  "skill_ball_control",
  "movement_acceleration",
  "movement_sprint_speed",
  "movement_agility",
  "movement_reactions",
  "movement_balance",
  "power_shot_power",
  "power_jumping",
  "power_stamina",
  "power_strength",
  "power_long_shots",
  "mentality_aggression",
  "mentality_interceptions",
  "mentality_positioning",
  "mentality_vision",
  "mentality_penalties",
  "mentality_composure",
  "defending_marking_awareness",
  "defending_standing_tackle",
  "defending_sliding_tackle",
  "goalkeeping_diving",
  "goalkeeping_handling",
  "goalkeeping_kicking",
  "goalkeeping_positioning",
  "goalkeeping_reflexes",
  "goalkeeping_speed",
  "ls",
  "st",
  "rs",
  "lw",
  "lf",
  "cf",
  "rf",
  "rw",
  "lam",
  "cam",
  "ram",
  "lm",
  "lcm",
  "cm",
  "rcm",
  "rm",
  "lwb",
  "ldm",
  "cdm",
  "rdm",
  "rwb",
  "lb",
  "lcb",
  "cb",
  "rcb",
  "rb",
  "gk",
  "player_face_url",
];

const router = express.Router();

//Manejo de rutas para autenticacion y registro
router.post("/login", usuarioController.login);

router.post("/register", usuarioController.register);

//Manejo de rutas para gestionar metodos HTTP relacionadas con los jugadores
router.get(
  "/obtener-jugadores",
  verificarLogin,
  manejarErrores,
  jugadorController.obtenerTodos
);

router.get(
  "/obtener-jugador/:id",
  verificarLogin,
  param("id").isInt().withMessage("El ID debe ser un número entero"),
  manejarErrores,
  jugadorController.obtenerPorId
);

router.post(
  "/crear-jugador",
  verificarLogin,
  manejarErrores,
  jugadorController.crear
);

router.put(
  "/modificar-jugador/:id",
  verificarLogin,
  filtrarCamposPermitidos(ALLOWED_FIELDS),
  jugadorController.actualizarJugador
);

router.get("/proxy-image", jugadorController.obtenerImagenes);

export default router;
