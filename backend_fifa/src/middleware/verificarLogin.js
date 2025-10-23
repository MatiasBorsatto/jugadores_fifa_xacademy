import jwt from "jsonwebtoken";

const verificarToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(403).json({
      message: "Token no proporcionado o inexistente. Vuelva a loguearse",
    });
  }

  jwt.verify(
    token,
    "95111aaa709a481b0a1b38fc78933416c70eaf622541364ac0b3f50c41c8b311ad9595a9e4d42c8ca33f3794c401fd0ec1991f62d4709ad15f246ff43b0cf6f3",
    (err, user) => {
      if (err) {
        return res.status(403).json({ message: "Token invalido o expirado" });
      }

      req.user = user;

      next();
    }
  );
};

export default verificarToken;
