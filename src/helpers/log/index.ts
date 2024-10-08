import  devLogger  from './devLog';
import  prodLogger  from './prodLog';

let logger: any;

if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'testing') {
  logger = devLogger;
} else {
  logger = prodLogger;
}

export default logger;