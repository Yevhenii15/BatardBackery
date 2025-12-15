import Booking from "../../models/Booking";

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  const bookingNumber = String(query.bookingNumber || "").trim();
  const lastName = String(query.lastName || "").trim();

  if (!bookingNumber || !lastName) {
    setResponseStatus(event, 400);
    return { message: "bookingNumber and lastName are required" };
  }

  const booking = await Booking.findOne({
    bookingNumber,
    "customer.lastName": {
      $regex: new RegExp(`^${escapeRegex(lastName)}$`, "i"),
    },
  }).lean();

  if (!booking) {
    setResponseStatus(event, 404);
    return { message: "Booking not found" };
  }

  return booking;
});
