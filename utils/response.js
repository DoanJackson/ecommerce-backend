import { StatusCodes } from "http-status-codes";

class ResponseWrapper {
  constructor(success, status, message, data = null) {
    this.success = success;
    this.status = status;

    Object.assign(this, this.cleanObject({ message, data }));
  }

  static success(status = StatusCodes.OK, message = "Success", data = null) {
    return new ResponseWrapper(true, status, message, data);
  }

  static error(errorCode) {
    return new ResponseWrapper(false, errorCode.status, errorCode.message);
  }

  cleanObject(obj) {
    return Object.fromEntries(
      Object.entries(obj).filter(([_, v]) => v != null && v !== undefined)
    );
  }
}

export default ResponseWrapper;
