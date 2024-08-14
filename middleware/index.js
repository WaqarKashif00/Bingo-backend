import { Unauthorized, BadRequest } from '../helpers/server-response.js';
import { verifyToken } from '../helpers/token.js';

export default function authorize(req, res, next) {
  if (!req.headers.hasOwnProperty('x-access-bingo-token')) {
    return Unauthorized(res, 'Authorization Failed!');
  }

  const token = req.headers['x-access-bingo-token'] ?? false;
  if (!token || !token.startsWith('Bingo ')) {
    return Unauthorized(res, 'Invalid Token!');
  }

  const verifiedUser = verifyToken(token.replace('Bingo ', ''));
  if (!verifiedUser) {
    return BadRequest(res, 'Session Expired!');
  }

  next();
}
