import Decoder from './LZMA/Decoder';
import { coerceInputStream, coerceOutputStream } from './Util';

export function decompress(properties, inStream, outStream, outSize){
  var decoder = new Decoder();

  if ( !decoder.setDecoderProperties(properties) ){
    throw "Incorrect stream properties";
  }

  if ( !decoder.code(inStream, outStream, outSize) ){
    throw "Error in data stream";
  }

  return true;
};

/* Also accepts a Uint8Array/Buffer/array as first argument, in which case
 * returns the decompressed file as a Uint8Array/Buffer/array. */
 export function decompressFile(inStream, outStream){
  var decoder = new Decoder(), i, mult;

  inStream = coerceInputStream(inStream);

  if ( !decoder.setDecoderPropertiesFromStream(inStream) ){
    throw "Incorrect stream properties";
  }

  // largest integer in javascript is 2^53 (unless we use typed arrays)
  // but we don't explicitly check for overflow here.  caveat user.
  var outSizeLo = 0;
  for (i=0, mult=1; i<4; i++, mult*=256) {
    outSizeLo += (inStream.readByte() * mult);
  }
  var outSizeHi = 0;
  for (i=0, mult=1; i<4; i++, mult*=256) {
    outSizeHi += (inStream.readByte() * mult);
  }
  var outSize = outSizeLo + (outSizeHi * 0x100000000);
  if (outSizeLo === 0xFFFFFFFF && outSizeHi === 0xFFFFFFFF) {
    outSize = -1;
  } else if (outSizeHi >= 0x200000) {
    outSize = -1; // force streaming
  }

  if (outSize >= 0 && !outStream) { outStream = outSize; }
  outStream = coerceOutputStream(outStream);

  if ( !decoder.code(inStream, outStream, outSize) ){
    throw "Error in data stream";
  }

  return ('getBuffer' in outStream) ? outStream.getBuffer() : true;
};

/* The following is a mapping from gzip/bzip2 style -1 .. -9 compression modes
 * to the corresponding LZMA compression modes. Thanks, Larhzu, for coining
 * these. */ /* [csa] lifted from lzmp.cpp in the LZMA SDK. */
var option_mapping = [
  { a:0, d: 0, fb: 0,  mf: null, lc:0, lp:0, pb:0 },// -0 (needed for indexing)
  { a:0, d:16, fb:64,  mf:"hc4", lc:3, lp:0, pb:2 },// -1
  { a:0, d:20, fb:64,  mf:"hc4", lc:3, lp:0, pb:2 },// -2
  { a:1, d:19, fb:64,  mf:"bt4", lc:3, lp:0, pb:2 },// -3
  { a:2, d:20, fb:64,  mf:"bt4", lc:3, lp:0, pb:2 },// -4
  { a:2, d:21, fb:128, mf:"bt4", lc:3, lp:0, pb:2 },// -5
  { a:2, d:22, fb:128, mf:"bt4", lc:3, lp:0, pb:2 },// -6
  { a:2, d:23, fb:128, mf:"bt4", lc:3, lp:0, pb:2 },// -7
  { a:2, d:24, fb:255, mf:"bt4", lc:3, lp:0, pb:2 },// -8
  { a:2, d:25, fb:255, mf:"bt4", lc:3, lp:0, pb:2 } // -9
];
