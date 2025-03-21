const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      match: [/\S+@\S+\.\S+/, "Invalid email format"],
      lowercase: true, // ✅ Automatically convert email to lowercase
    },
    address: {
      city: { type: String, required: true },
      country: { type: String, required: true },
      state: { type: String, required: true },
      zipcode: { type: String, required: true },
    },
    phone: {
      type: String,
      required: true,
      match: [/^\d{10}$/, "Phone number must be 10 digits"],
    },
    productIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book",
        required: true,
      },
    ],
    totalPrice: {
      type: Number,
      required: [true, "Total price is required"],
      min: [1, "Total price must be greater than zero"],
    },
  },
  {
    timestamps: true, // ✅ Adds `createdAt` & `updatedAt` fields automatically
  }
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
