import { Storage } from '@google-cloud/storage';

const storage = new Storage({
  keyFilename: process.env.KEY_FILE_NAME,
});
const bucket = storage.bucket('tomguard');

export { bucket };
