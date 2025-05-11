class BaseResponse {
  static success(data, message = 'Success') {
    return {
      success: true,
      message,
      data,
    };
  }

  static error(message) {
    return {
      success: false,
      message,
    };
  }
}

module.exports = BaseResponse;
