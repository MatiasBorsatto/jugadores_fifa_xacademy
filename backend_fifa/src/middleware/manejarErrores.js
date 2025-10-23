import { validationResult } from "express-validator";

export const manejarErrores = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }
  next();
};

export function filtrarCamposPermitidos(allowedFields) {
  return function (req, res, next) {
    req.filteredBody = Object.fromEntries(
      Object.entries(req.body).filter(([key]) => allowedFields.includes(key))
    );
    next();
  };
}
