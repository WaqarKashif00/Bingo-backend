import UserModel from './model.js';
import { Ok, InternalServerError, NotFound, BadRequest } from '../../helpers/server-response.js';
import { generateToken, verifyToken } from '../../helpers/token.js';

const result = (total) => (total ? 'successfully' : 'not');

const createUser = async (req, res) => {
  try {
    const { user_name, name, password } = req.body;

    const existingUser = await new UserModel().findOne({ user_name });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists with this email', data: {} });
    }

    const token = generateToken(user_name, password);
    await new UserModel().create({ user_name, token, name, password });
    const message = 'User successfully created';

    return Ok(res, message, `${process.env.AUTH_KEY} ${token}`);
  } catch (err) {
    console.error(err.message);
    return InternalServerError(res, err.message);
  }
};

const loginUser = async (req, res) => {
  try {
    const { user_name, password } = req.body;

    const existingUser = await new UserModel().findOne({ user_name });
    if (!existingUser) {
      return NotFound(res, 'User Not Found');
    }

    const verifiedUser = verifyToken(existingUser.token);
    if (!verifiedUser) {
      return BadRequest(res, 'User blocked!');
    }

    if (verifiedUser.password !== password) {
      return BadRequest(res, 'Invalid username/ password');
    }

    const newToken = generateToken(user_name, password);
    await new UserModel(existingUser.id).update({ token: newToken });
    existingUser.password = undefined;
    existingUser.token = `${process.env.AUTH_KEY} ${existingUser.token}`;
    const message = `User ${result(existingUser)} found`;

    return Ok(res, message, existingUser);
  } catch (err) {
    console.error(err.message);
    return InternalServerError(res, err.message);
  }
};

// const getUsers = async (req, res) => {
//   try {
//     const users = await new UserModel().find(req.query);

//     const message = `User ${result(users.length)} found`;
//     return Ok(res, message, users);
//   } catch (err) {
//     console.error(err.message);
//     return InternalServerError(res, err.message);
//   }
// };

// const updateUser = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const user = await new UserModel(id).update(req.body);

//     const message = `User ${result(user)} updated`;
//     return Ok(res, message, user);
//   } catch (err) {
//     console.error(err.message);
//     return InternalServerError(res, err.message);
//   }
// };

// const deleteUser = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const user = await new UserModel(id).update({ is_deleted: true });

//     return Ok(res, `User ${result(user)} deleted`, user);
//   } catch (err) {
//     console.error(err.message);
//     return InternalServerError(res, err.message);
//   }
// };

export { createUser, loginUser };
