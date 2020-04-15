import { logger } from './../config';

class ResponseHelper {
  public Ok = (res: any, data: any) => {
    this.jsonResponse(res, data);
  }
  public jsonResponse(res: any, body = {}, status = 200) {
    res.status(status).json(body || null);
  }
  public Error = (req, res: any, data: any, code = 500) => {
    try {
      const reqData = {
        query: req.query,
        baseUrl: req.baseUrl,
        body: req.body,
        time: new Date(),
        method: req.method,
        host: req.host,
        user: 'xxyyzz'
      };
      logger.error(`StatusCode:${code} Request: ${JSON.stringify(reqData)} Response: ${data.toString()}`);
    } catch (error) {
      console.log(error);
    }
    this.jsonResponse(res, data, code);
  }
}

export default new ResponseHelper();
