import { Router } from 'express';
import EventController from '../controllers/EventsController.js';
import UserController from '../controllers/UsersController.js';
import { verifyToken, authorize } from '../middleware/authenticate.js';
import createTicket from '../utils/createTicket.js';


const router = Router();

// User Routes
// router.post('/register', );
// router.post('/login',);

// Event Routes
router.get('/events', EventController.getAllEvents );
router.get('/events/:id', EventController.getEventById );
router.post('/events', verifyToken, authorize('organizer'), EventController.createEvent );
router.delete('/events/:id', verifyToken, EventController.deleteEvent );

// Register user
router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.get('/logout', verifyToken, UserController.logout);
router.get('/me', verifyToken, UserController.getProfile);

router.post('/events/:eventId', createTicket);


export default router;
