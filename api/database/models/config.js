
import mongoose from 'mongoose';

const boolean = {
  type: String,
  enum: ['off', 'on'],
};

const params = {
  // Default values
  'inpstr1-type': {
    type: String,
    default: 'serial',
  },
  'inpstr1-path': {
    type: String,
    default: 'ttyAMA4:115200:8:n:1:off',
  },
  'inpstr1-format': {
    type: String,
    default: 'ubx',
  },
  'outstr1-type': {
    type: String,
    default: 'tcpsvr',
  },
  'outstr1-path': {
    type: String,
    default: '127.0.0.1:50',
  },
  'outstr1-format': {
    type: String,
    default: 'nmea',
  },
  // End default values
  'pos1-posmode': {
    type: String,
    enum: ['single', 'dgps', 'kinematic', 'static', 'static-start', 'movingbase', 'fixed', 'ppp-kine', 'ppp-static', 'ppp-fixed'],
  },
  'pos1-frequency': {
    type: String,
    enum: ['l1', 'l1+l2', 'l1+l2+l5']
  },
  'pos1-soltype': {
    type: String,
    enum: ['forward', 'backward', 'combined']
  },
  'pos1-elmask': {
    type: Number,
    min: 0,
    max: 30,
  },
  'pos1-snrmask': {
    type: Number,
    min: 0,
    max: 40,
  },
  'snrmask_r': boolean,
  'pos1-snrmask_b': boolean,
  'pos1-snrmask_L1': String, // TODO
  'pos1-snrmask_L2': String, // TODO
  'pos1-snrmask_L5': String, // TODO
  'pos1-dynamics': boolean,
  'pos1-posopt1': boolean,
  'pos1-posopt2': boolean,
  'pos1-posopt3': boolean,
  'pos1-posopt4': boolean,
  'pos1-posopt5': boolean,
  'pos1-exclsat': String,
  'pos1-navsys': String, // TODO
  'pos2-armode': {
    type: String,
    enum: ['off', 'continuous', 'instantaneous', 'fix-and-hold']
  },
  'pos2-varholdamb': String,
  'pos2-gloarmode': {
    type: String,
    enum: ['off', 'on', 'autocal']
  },
  'pos2-gainholdamb': String,
  'pos2-arthres': String,
  'pos2-arfilter': String,
  'pos2-arthres1': String,
  'pos2-arthres2': String,
  'pos2-arthres3': String,
  'pos2-arthres4': String,
  'pos2-arlockcnt': String,
  'pos2-minfixsats': Number,
  'pos2-minholdsats': Number,
  'pos2-mindropsats': Number,
  'pos2-rcvstds': String,
  'pos2-arelmask': Number,
  'pos2-arminfix': String,
  'pos2-elmaskhold': Number,
  'pos2-aroutcnt': Number,
  'pos2-maxage': Number,
  'pos2-rejionno': Number,
  'out-solformat': {
    type: String,
    enum: ['llh', 'xyz', 'enu', 'nmea']
  },
  'out-outhead': boolean,
  'out-outopt': boolean,
  'out-outstat': {
    type: String,
    enum: ['off', 'state', 'residual']
  },
  'stats-eratio1': Number,
  'stats-eratio2': Number,
  'stats-prnaccelh': Number,
  'stats-prnaccelv': Number,
  'ant2-postype': String,
  'ant2-maxaveep': Number,
  'misc-timeinterp': String,
};


const configSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  mtime: {
    type: Date,
    default: Date.now,
  },
  options: params,
});

// This will be used in all cases
configSchema.pre('save', function (next) {
  this.options['inpstr1-type'] = 'serial';
  this.options['inpstr1-path'] = 'ttyAMA4:115200:8:n:1:off';
  this.options['inpstr1-format'] = 'ubx';
  this.options['outstr1-type'] = 'tcpsvr';
  this.options['outstr1-path'] = '127.0.0.1:50';
  this.options['outstr1-format'] = 'nmea';
  next();
});


mongoose.set('useFindAndModify', false);


const ConfigModel = mongoose.model('Config', configSchema);

const rtkDictionary = Object.keys(params);


export { ConfigModel, rtkDictionary	};
