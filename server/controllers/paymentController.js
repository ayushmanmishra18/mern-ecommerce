const asyncHandler = require('express-async-handler');

const createPayment = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Payment processed successfully (mock)',
    paymentId: `mock_${Date.now()}`
  });
});

module.exports = { createPayment };
