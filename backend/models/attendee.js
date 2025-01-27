import mongoose from 'mongoose';

const attendeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  ticket_category: { type: String, required: true },
});

const Attendee = mongoose.model('Attendee', attendeeSchema);

export default Attendee;
