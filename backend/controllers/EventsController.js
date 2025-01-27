import mongoose from 'mongoose';
import Event from '../models/event.js';
import { verifyToken } from '../middleware/authenticate.js';



class EventController {
  // Create a new event
  static async createEvent(req, res) {
    try {
      const { name, description,  date,ticket_categories, tickets, location } = req.body;
      const organizer = req.user.id; 

      const event = new Event({
        name,
        description,
        organizer,
        date,
        ticket_categories,
        tickets,
        location,
      });

      const savedEvent = await event.save();
      res.status(201).json(savedEvent);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get all events
  static async getAllEvents(req, res) {
    try {
      const events = await Event.find();
      res.status(200).json(events);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get an event by ID
  static async getEventById(req, res) {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid event ID' });
      }

      const event = await Event.findById(id);

      if (!event) {
        return res.status(404).json({ error: 'Event not found' });
      }

      res.status(200).json(event);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Update an event
  static async updateEvent(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid event ID' });
      }

      const updatedEvent = await Event.findByIdAndUpdate(id, updates, { new: true });

      if (!updatedEvent) {
        return res.status(404).json({ error: 'Event not found' });
      }

      res.status(200).json(updatedEvent);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Delete an event
  static async deleteEvent(req, res) {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid event ID' });
      }

      const deletedEvent = await Event.findByIdAndDelete(id);

      if (!deletedEvent) {
        return res.status(404).json({ error: 'Event not found' });
      }

      res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get events by organizer
  static async getEventsByOrganizer(req, res) {
    try {
      const { organizerId } = req.params;

      if (!mongoose.Types.ObjectId.isValid(organizerId)) {
        return res.status(400).json({ error: 'Invalid organizer ID' });
      }

      const events = await Event.find({ organizer: organizerId });

      res.status(200).json(events);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default EventController;
