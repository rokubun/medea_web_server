import { PORT } from '../../config';

/**
 * GET METHOD
 */
const getWelcome = (req, res) => {
  res.send(`<h4>Medea API currently running on PORT => ${PORT} </h4>`);
}

export default getWelcome;
