import cors from "cors";
import express from "express";
import router from "./src/routes/routes.js";
import sequelize from "./src/config/dbConfig.js";

const app = express();
const PORT = 3000;

// Middleware para JSON
app.use(express.json());

// Middleware para habilitar CORS
app.use(cors({ origin: "http://localhost:4200" }));

app.use((req, res, next) => {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  next();
});

app.use("/api", router);

// Función para conectar con la base de datos
async function connectDB() {
  let connected = false;
  while (!connected) {
    try {
      await sequelize.authenticate();
      console.log("Conectado a MySQL correctamente");
      connected = true;
    } catch (error) {
      console.error("Error de conexión:", error.message);
      await new Promise((res) => setTimeout(res, 2000));
    }
  }

  // Sincronizar modelos y arrancar servidor
  try {
    await sequelize.sync({ alter: true });
    console.log("Modelos sincronizados con la base de datos.");
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Servidor escuchando en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error al sincronizar la base de datos:", error);
  }
}

// Ejecutar
connectDB();
