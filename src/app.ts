import express from 'express';
import cors from 'cors';
import { ApiRouting } from './api.routing';
import { logger } from './config';
// import { sequelize } from './helpers';
class App {
  public express: express.Express;
  // public routePrv: Routes = new Routes();

  constructor() {
    this.setEnvironment();
    // this.database();
    this.express = express();
    this.middleware();
    this.initializeControllers();
  }

  /**
   * database connection
   */
  // private async database() {
  //   sequelize.setConnection();
  // }

  /**
   * http(s) request middleware
   */
  private middleware(): void {
    const corsOption = {
      credentials: true,
      exposedHeaders: ['x-auth-token'],
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      origin: true
    };

    // this.express.set('view engine', 'pug');
    // this.express.set('views', path.join(__dirname, 'views'));
    this.express.use(cors(corsOption));
    this.express.use(express.urlencoded());
    this.express.use(express.json());
    this.express.use((err, req, res, next) => {
      logger.error(err.toString());
      next();
    });
  }

  /**
   * app environment configuration
   */
  private setEnvironment(): void {
    // dotenv.config({ path: ".env" });
  }

  /**
   * API main routes
   */
  private initializeControllers() {
    this.InitRoute();
    this.express.use('*', (req, res) => {
      res.status(404).send({ error: `\/${req.baseUrl}\/ doesn't exist` });
    });
  }

  private InitRoute() {
    ApiRouting.Register(this.express);
  }
}

export default new App().express;
