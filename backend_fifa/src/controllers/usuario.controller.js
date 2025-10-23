import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import usuarioService from "../services/usuario.service.js";

const JWT_SECRET =
  "95111aaa709a481b0a1b38fc78933416c70eaf622541364ac0b3f50c41c8b311ad9595a9e4d42c8ca33f3794c401fd0ec1991f62d4709ad15f246ff43b0cf6f3";

//logica de Login
class UsuarioController {
  async login(req, res) {
    const { email, password } = req.body;

    try {
      const user = await usuarioService.emailExiste(email);

      if (!user) {
        return res.status(404).json({
          error:
            "El email no existe o es incorrecto, pruebe con otro o registrese.",
        });
      }

      // comparar contraseña
      const match = await bcrypt.compare(password, user.password_hash);

      if (!match) {
        return res.status(401).json({ error: "Contraseña incorrectos" });
      }

      // generar token
      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
        expiresIn: "1h",
      });

      // responder con token
      res.json({ message: "Login correcto!", token });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error en el servidor" });
    }
  }

  async register(req, res) {
    const { email, password } = req.body;

    try {
      // aca se verifica email unico
      const existing = await usuarioService.emailExiste(email);
      if (existing) {
        return res
          .status(400)
          .json({ error: "El email ya existe, intente con otro" });
      }
      // se hashea pass
      const password_hash = await bcrypt.hash(password, 10);

      // Se inserta el user
      await usuarioService.register(email, password_hash);

      res.json({ message: "Registro correcto!" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error en el servidor" });
    }
  }
}

export default new UsuarioController();
