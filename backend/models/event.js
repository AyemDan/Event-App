import mongoose from 'mongoose';

const ticketCategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  description: { type: String },
});

const AttendeeSchema = new mongoose.Schema({
  // user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // If linked to a User model
  name: { type: String, required: true },
  email: { type: String, required: true },
  ticket_category: { type: String, required: true },
});

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  isFree: { type: Boolean, default: false },
  ticket_categories: [ticketCategorySchema],
  tickets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ticket' }],
  createdAt: { type: Date, default: Date.now },
  attendees: [AttendeeSchema],
});

const Event = mongoose.model('Event', eventSchema);
export default Event;
