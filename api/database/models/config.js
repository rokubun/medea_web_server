
import mongoose from 'mongoose';


const SWTOPT = ['off', 'on'];
const MODOPT = ['single', 'dgps', 'kinematic', 'static', 'static-start', 'movingbase', 'fixed', 'ppp-kine' , 'ppp-static', 'ppp-fixed']
const FRQOPT = ['l1', 'l1+l2', 'l1+l2+e5b', 'l1+l2+e5b+l5'];
const TYPOPT = ['forward', 'backward', 'combined'];
const IONOPT = ['off', 'brdc', 'sbas', 'dual-freq', 'est-stec', 'ionex-tec', 'qzs-brdc', 'qzs-lex', 'stec'];
const TRPOPT = ['off', 'saas', 'sbas', 'est-ztd', 'est-ztdgrad', 'ztd'];
const EPHOPT = ['brdc', 'precise', 'brdc+sbas', 'brdc+ssrapc', 'brdc+ssrcom'];
const NAVOPT = ['1:gps+2:sbas+4:glo+8:gal+16:qzs+32:comp'];
const GAROPT = ['off', 'on', 'autocal', 'fix-and-hold'];
const SOLOPT = ['llh', 'xyz', 'enu', 'nmea'];
const TSYOPT = ['gpst', 'utc', 'jst'];
const TFTOPT = ['tow', 'hms'];
const DFTOPT = ['deg', 'dms'];
const HGTOPT = ['ellipsoidal', 'geodetic'];
const GEOOPT = ['internal', 'egm96', 'egm08_2.5', 'egm08_1', 'gsi2000'];
const STAOPT = ['all' , 'single'];
const STSOPT = ['off', 'state', 'residual'];
const ARMOPT = ['off', 'continuous', 'instantaneous', 'fix-and-hold'];
const POSOPT = ['llh', 'xyz', 'single', 'posfile', 'rinexhead', 'rtcm', 'raw'];
const TIDEOPT = ['off','on', 'otl'];
const PHWOPT = ['off', 'on', 'precise'];

// RTK input and output configs
const ISTOPT = ['off', 'serial', 'file', 'tcpsvr', 'tcpcli', 'ntripcli', 'ftp', 'http'];
const FMTOPT = ['rtcm2', 'rtcm3', 'oem4', 'oem3', 'ubx', 'ss2', 'hemis', 'skytraq', 'gw10', 'javad', 'nvs', 'binex', 'rt17', 'sp3'];

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
    enum: MODOPT,
  },
  'pos1-frequency': {
    type: String,
    enum: FRQOPT,
  },
  'pos1-soltype': {
    type: String,
    enum: TYPOPT,
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
  'pos1-snrmask_r': {
    type: String,
    enum: SWTOPT,
  },
  'pos1-snrmask_b': {
    type: String,
    enum: SWTOPT,
  },
  'pos1-snrmask_L1': {
    type: Number,
    min: 0,
    max: 40,
  },
  'pos1-snrmask_L2': {
    type: Number,
    min: 0,
    max: 40,
  },
  'pos1-snrmask_L5': {
    type: Number,
    min: 0,
    max: 40,
  },
  'pos1-dynamics': {
    type: String,
    enum: SWTOPT,
  },
  'pos1-tidecorr': {
    type: String,
    enum: TIDEOPT,
  },
  'pos1-ionoopt': {
    type: String,
    enum: IONOPT,
  },
  'pos1-tropopt': {
    type: String,
    enum: TRPOPT,
  },
  'pos1-posopt1': {
    type: String,
    enum: SWTOPT,
  },
  'pos1-posopt2': {
    type: String,
    enum: SWTOPT,
  },
  'pos1-posopt3': {
    type: String,
    enum: PHWOPT,
  },
  'pos1-posopt4': {
    type: String,
    enum: SWTOPT,
  },
  'pos1-posopt5': {
    type: String,
    enum: SWTOPT,
  },
  'pos1-posopt6': {
    type: String,
    enum: SWTOPT,
  },
  'pos1-exclsats': String, // TODO
  'pos1-navsys': {
    type: Number,
    min: 1,
    max: 63,
  },
  'pos2-armode': {
    type: String,
    enum: ARMOPT,
  },
  'pos2-gloarmode': {
    type: String,
    enum: GAROPT,
  },
  'pos2-bdsarmode': {
    type: String,
    enum: SWTOPT,
  },
  'pos2-arfilter': {
    type: String,
    enum: SWTOPT,
  },
  'pos2-arthres': String, // TODO
  'pos2-arthres1': String, // TODO
  'pos2-arthres2': String, // TODO
  'pos2-arthres3': String, // TODO
  'pos2-arthres4': String, // TODO
  'pos2-varholdamb': Number, // TODO
  'pos2-gainholdamb': String, // TODO
  'pos2-arlockcnt': String, // TODO
  'pos2-minfixsats': String, // TODO
  'pos2-minholdsats': String, // TODO
  'pos2-mindropsats': String, // TODO
  'pos2-rcvstds': {
    type: String,
    enum: SWTOPT,
  }, 
  'pos2-arelmask': {
    type: Number,
    min: 0,
    max: 60,
  },
  'pos2-arminfix': String, // TODO
  'pos2-armaxiter': String, // TODO 
  'pos2-elmaskhold': {
    type: Number,
    min: 0,
    max: 60,
  },
  'pos2-aroutcnt': Number, // TODO
  'pos2-maxage': Number, // TODO
  'pos2-syncsol': {
    type: String,
    enum: SWTOPT,
  },
  'pos2-rejionno': Number, // TODO
  'pos2-rejgdop' : Number, // TODO
  'pos2-niter': Number, // TODO
  'pos2-baselen': Number,
  'pos2-basesig': Number,
  // OUTPUT
  'out-solformat': {
    type: String,
    enum: SOLOPT,
  },
  'out-outhead': {
    type: String,
    enum: SWTOPT,
  },
  'out-outopt': {
    type: String,
    enum: SWTOPT,
  },
  'out-outvel': {
    type: String,
    enum: SWTOPT,
  },
  'out-timesys': {
    type: String,
    enum: TSYOPT,
  },
  'out-timeform': {
    type: String,
    enum: TFTOPT,
  },
  'out-timendec': String, // TODO
  'out-degform': {
    type: String,
    enum: DFTOPT,
  },
  'out-fieldsep': String, // TODO
  'out-outsingle': {
    type: String,
    enum: SWTOPT,
  },
  'out-maxsolstd': String, // TODO
  'out-height': {
    type: String,
    enum: HGTOPT,
  },
  'out-geoid': {
    type: String,
    enum: GEOOPT,
  },
  'out-solstatic': {
    type: String,
    enum: STAOPT,
  },
  'out-nmeaintv1': String, // TODO
  'out-nmeaintv2': String, // TODO
  'out-outstat': {
    type: String,
    enum: STSOPT,
  },
  // STATS
  'stats-eratio1': Number, // TODO
  'stats-eratio2': Number, // TODO
  'stats-errphase': Number, // TODO
  'stats-errphaseel': Number, // TODO
  'stats-errphasebl': Number, // TODO
  'stats-errdoppler': Number, // TODO
  'stats-stdbias': Number, // TODO
  'stats-stdiono': Number, // TODO
  'stats-stdtrop': Number, // TODO
  'stats-prnaccelh': Number, // TODO
  'stats-prnaccelv': Number, // TODO
  'stats-prnbias': Number, // TODO
  'stats-prniono': Number, // TODO
  'stats-prntrop': Number,
  'stats-prnpos': Number,
  'stats-clkstab': Number,
  //  ANT1
  'ant1-postype': {
    type: String,
    enum: POSOPT,
  },
  'ant1-pos1': Number, // TODO
  'ant1-pos2': Number, // TODO
  'ant1-pos3': Number, // TODO
  'ant1-anttype': Number, // TODO
  'ant1-antdele': Number, // TODO
  'ant1-antdeln': Number, // TODO
  'ant1-antdelu': Number, // TODO
  // ANT2
  'ant2-postype': {
    type: String,
    enum: POSOPT,
  },
  'ant2-pos1': Number, // TODO
  'ant2-pos2': Number, // TODO
  'ant2-pos3': Number, // TODO
  'ant2-anttype': Number, // TODO
  'ant2-antdele': Number, // TODO
  'ant2-antdeln': Number, // TODO
  'ant2-antdelu': Number, // TODO
  'ant2-maxaveep': Number, // TODO
  'ant2-initrst': {
    type: String,
    enum: SWTOPT,
  },
  // MISC
  'misc-timeinterp': {
    type: String,
    enum: SWTOPT,
  },
  'misc-sbasatsel': {
    type: String,
    enum: [ 'all' ],
  },
  'misc-rnxopt1': String,
  'misc-rnxopt2': String,
  'misc-pppopt': String,
  // FILE
  'file-satantfile': String,
  'file-rcvantfile': String,
  'file-staposfile': String,
  'file-geoidfile': String,
  'file-ionofile': String,
  'file-dcbfile': String,
  'file-eopfile': String,
  'file-blqfile': String,
  'file-tempdir': String,
  'file-geexefile': String,
  'file-solstatfile': String,
  'file-tracefile': String,
  // Input String RTK
  'inpstr2-type': {
    type: String,
    enum: ISTOPT,
  },
  'inpstr2-path': String,
  'inpstr2-format': {
    type: String,
    enum: FMTOPT,
  }
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
