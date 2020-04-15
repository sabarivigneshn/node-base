export class ErrorHandler extends Error {
  constructor() {
    super();
  }
  public throwError = (err = 'Internal server Error') => {
    throw new Error(err);
  }

  public handleError = (err = `Internal server Error`) => {
    return err;
  }
}
