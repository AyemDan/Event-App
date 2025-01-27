import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
  owner_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  event_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  event_name: {
    type: String,
    required: true
  },
  ticket_category: {
    type: String,
    required: true
  },
  category_description: {
    type: String
  },
  price: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['reserved', 'confirmed', 'cancelled'],
    default: 'reserved'
  },
  issued_at: {
    type: Date,
    default: Date.now
  },
  qr_code: {
    type: String, // Store the base64 encoded QR code or a URL to the generated image
    required: true
  }
});

const Ticket = mongoose.model('Ticket', ticketSchema);
export default Ticket;  