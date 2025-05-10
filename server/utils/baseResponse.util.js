const baseResponse = (res, { success = true, status = 200, message = 'Success', data = null }) => {
  return res.status(status).json({
    success,
    message,
    data
  });
};

module.exports = baseResponse;
