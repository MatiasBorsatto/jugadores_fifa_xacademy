import Usuario from "../models/usuario.model.js";

class UsuarioService {
  // verificar existencia de email
  async emailExiste(email) {
    return await Usuario.findOne({ where: { email } });
  }

  async register(email, password_hash) {
    return await Usuario.create({
      email,
      password_hash,
    });
  }
}

export default new UsuarioService();
