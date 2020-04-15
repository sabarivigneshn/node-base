import debug from 'debug';
import * as http from 'http';
import App from './app';
import { AppSetting } from './config';

class Server {
  public static port = AppSetting.getConfig().Port;
  public static bootstrap(): Server {
    if (!this.serverInstance) {
      this.serverInstance = new Server();
      return this.serverInstance;
    } else {
      return this.serverInstance;
    }
  }

  private static serverInstance: Server;
  private server: any;
  private port: number | undefined;

  public constructor() {
    this.debugMod();
    this.runServer();
  }

  public getServerInstance(): any {
    return this.server;
  }

  private debugMod(): void {
    debug('ts-express:server');
    // winston.add(winston.transports.File);
  }

  private runServer(): void {
    this.port = this.normalizePort(Server.port || 5000);
    console.log(this.port);
    App.set('port', this.port);
    debug(this.port.toString());
    this.createServer();
  }

  private createServer() {
    this.server = http.createServer(App);
    this.server.listen(this.port);
    this.server.on('listening', () => {
      const address = this.server.address();
      const bind =
        typeof address === 'string'
          ? `pipe ${address}`
          : `port ${address.port}`;
      debug(`Listening on ${bind}`);
    });

    this.server.on('error', (error: NodeJS.ErrnoException) => {
      if (error.syscall !== 'listen') {
        throw error;
      }
      process.exit(1);
    });

    this.server.on('exit', code => {
      process.exit(code);
    });

    this.server.on('SIGTERM', code => {
      process.exit(code);
    });
  }

  /**
   * normalize port
   * @param {number | string} val
   * @returns {number}
   */

  private normalizePort(val: number | string): number {
    const port: number = typeof val === 'string' ? parseInt(val, 10) : val;
    return port;
  }
}

export const server = Server.bootstrap();
