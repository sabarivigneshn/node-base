import * as express from 'express';
import { AppSetting } from './config';
import { UserController, SsoController } from './controllers';
export class ApiRouting {
  public static baseRoute = AppSetting.getConfig().BaseRoute;
  public static Register(app: express.Express) {
    app.use(ApiRouting.baseRoute + UserController.route, new UserController().router);
    app.use(ApiRouting.baseRoute + SsoController.route, new SsoController().router);
    app.get(ApiRouting.baseRoute + '/ping', (req, res) => {
      res.send('Pong');
    });
  }
}
