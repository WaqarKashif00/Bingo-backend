import pkg from 'jsonwebtoken';
const { sign, verify } = pkg;

const generateToken = (email, password) => {
  return sign({ email, password }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};

const verifyToken = (token) => {
  return verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return false;
    } else {
      return decoded;
    }
  });
};

export { generateToken, verifyToken };
