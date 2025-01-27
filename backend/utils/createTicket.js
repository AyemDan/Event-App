import Ticket from '../models/ticket.js';
import Event from '../models/event.js';
import Attendee from '../models/attendee.js';
import QRCode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';
import { generateTicketToken } from './generateToken.js';

// POST /tickets
const createTicket = async (req, res) => {
  try {
    const { fullName, email, quantity } = req.body; // User details and quantity
    const userId = uuidv4();

    // Fetch the event
    const { eventId } = req.params;
    const { ticketCategory } = req.query;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Find the requested ticket category
    const category = event.ticket_categories.find(cat => cat.name === ticketCategory);
    if (!category) {
      return res.status(400).json({ error: 'Invalid ticket category' });
    }
    // Check availability
    if (category.quantity < quantity) {
      return res.status(400).json({ error: 'Not enough tickets available' });
    }

    // Generate ticket data for one operation
    const ticketId = uuidv4();
    const ticketData = {
      owner_id: event.organizer, // Generated user ID
      event_id: event._id, // Event ID
      event_name: event.name, // Event name
      ticket_category: category.name, // Category of the ticket
      price: category.price, // Ticket price
      expiryDate: new Date(event.date).getTime(), // Event's expiry date
    };

    // Generate token and QR code
    const token = generateTicketToken(ticketData);
    const qrCode = await QRCode.toDataURL(token);

    // Save the ticket to the database
    const ticket = new Ticket({
      ...ticketData,
      status: 'reserved',
      qr_code: qrCode, // QR code image
    });
 
    await ticket.save().then((savedTicket) => console.log('Ticket saved:', savedTicket))
    .catch((error) => console.error('Error saving ticket:', error));;

    // Deduct ticket quantity from the category
    category.quantity -= quantity;

    // Add attendee to the event
    const attendee = new Attendee({
      name: fullName,
      email: email,
      ticket_category: ticketCategory,
    });
    event.attendees.push(attendee);

    await event.save();

    // Return success response
    res.status(201).json({ message: 'Ticket created successfully', ticket });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

export default createTicket;
