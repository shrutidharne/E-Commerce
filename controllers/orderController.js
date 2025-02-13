const { StatusCodes } = require("http-status-codes");
const { BadRequest, NotFound } = require("../errors");
const Order = require("../models/orderModel");
const Product = require("../models/productModel");

// for users to view their orders and one particular order and create order
const createOrder = async (req, res) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    totalPrice,
    shippingPrice,
  } = req.body;
  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    totalPrice,
    shippingPrice,
    user: req.user._id,
    paidAt: Date.now(),
  });
  res.status(StatusCodes.OK).json({
    success: true,
    order,
  });
};

const getAllMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.status(StatusCodes.OK).json({
    success: true,
    orders,
  });
};

const getMyOneOrder = async (req, res) => {
  const order = await Order.findOne({
    user: req.user._id,
    _id: req.params.id,
  }).populate("user", "name email");
  if (!order) {
    throw new BadRequest(`No such order found`);
  }
  res.status(StatusCodes.OK).json({
    success: true,
    order,
  });
};

//for admins to  update and delete order
const getAllOrders = async (req, res) => {
  const orders = await Order.find().populate("user", "name email");
  res.status(StatusCodes.OK).json({
    success: true,
    orders,
  });
};
async function updateStock(orderItem) {
  const product = await Product.findById(orderItem.product);
  product.stock -= orderItem.quantity;
  await product.save({ validateBeforeSave: false });
}

const updateOrder = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    throw new BadRequest(`No such order found`);
  }

  if (order.orderStatus === "Delivered") {
    throw new BadRequest(`Order has already been delivered`);
  }

  order.orderItems.forEach(async (orderItem) => {
    await updateStock(orderItem);
  });

  order.orderStatus = req.body.status;
  if (req.body.status === "Delivered") {
    order.deliveredAt = Date.now();
  }
  await order.save({ validateBeforeSave: false });
  res.status(StatusCodes.OK).json({
    success: true,
  });
};

const deleteOrder = async (req, res) => {
  //have to remove data from cloud as well
  const order = await Order.findById(req.params.id);

  if (!order) {
    throw new NotFound(`No order found`);
  }

  await order.remove();

  res.status(StatusCodes.OK).json({
    success: true,
  });
};

module.exports = {
  createOrder,
  getAllMyOrders,
  getMyOneOrder,
  updateOrder,
  deleteOrder,
  getAllOrders,
};
