import { AppDataSource } from "./core/database/data-source.js";
import { logger } from "./core/logger/logger.js";
import config from "./config/config.js"
import app from "./app.js";

const PORT = config.port;

// start server after db connection
AppDataSource.initialize()
  .then(() => {
    logger.info("Database connected");

    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err)
    logger.info("DB connection error", err);
  });
