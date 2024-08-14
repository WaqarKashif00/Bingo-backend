import HistoryModel from './model.js';
import { Ok, InternalServerError } from '../../helpers/server-response.js';

const result = (total) => (total ? 'successfully' : 'not');

const getHistory = async (req, res) => {
  try {
    const history = await new HistoryModel().find();

    return Ok(res, `History ${result(history.length)} found`, history);
  } catch (err) {
    console.error(err.message);
    return InternalServerError(res, err.message);
  }
};

export { getHistory };
