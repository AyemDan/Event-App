import jwt from 'jsonwebtoken';

const generateUserToken = (user) => {
  const payload = { id: user._id, role: user.role };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
};

const generateTicketToken = (ticketData) => {
  const secretKey = process.env.JWT_SECRET;
  const token = jwt.sign(ticketData, secretKey, { expiresIn: '24h' });
  return token;
};

export default generateUserToken; // Default export

export { generateTicketToken }; // Named export
