
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: String,
  password: String,
  currentConf: String,
  ubloxPath: String,
});

export default mongoose.model('User', userSchema);
