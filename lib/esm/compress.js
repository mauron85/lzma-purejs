import Encoder from './LZMA/Encoder';
import { coerceInputStream, coerceOutputStream } from './Util';

/** Create and configure an Encoder, based on the given properties (which
 *  make be a simple number, for a compression level between 1 and 9. */
 var makeEncoder = function(props) {
    var encoder = new Encoder();
    var params = { // defaults!
      a: 1, /* algorithm */
      d: 23, /* dictionary */
      fb: 128, /* fast bytes */
      lc: 3, /* literal context */
      lp: 0, /* literal position */
      pb: 2, /* position bits */
      mf: "bt4", /* match finder (bt2/bt4) */
      eos: false /* write end of stream */
    };
    // override default params with props
    if (props) {
      if (typeof(props)==='number') { // -1 through -9 options
        props = option_mapping[props];
      }
      var p;
      for (p in props) {
        if (Object.prototype.hasOwnProperty.call(props, p)) {
          params[p] = props[p];
        }
      }
    }
    encoder.setAlgorithm(params.a);
    encoder.setDictionarySize( 1<< (+params.d));
    encoder.setNumFastBytes(+params.fb);
    encoder.setMatchFinder((params.mf === 'bt4') ?
                           Encoder.EMatchFinderTypeBT4 :
                           Encoder.EMatchFinderTypeBT2);
    encoder.setLcLpPb(+params.lc, +params.lp, +params.pb);
    encoder.setEndMarkerMode(!!params.eos);
    return encoder;
};
  
export function compress(inStream, outStream, props, progress){
    var encoder = makeEncoder(props);
  
    encoder.writeCoderProperties(outStream);
  
    encoder.code(inStream, outStream, -1, -1, {
      setProgress: function(inSize, outSize) {
        if (progress) { progress(inSize, outSize); }
      }
    });
  
    return true;
  };
  
  /* Also accepts a Uint8Array/Buffer/array as first argument, in which case
   * returns the compressed file as a Uint8Array/Buffer/array. */
   export function compressFile(inStream, outStream, props, progress) {
    var encoder = makeEncoder(props);
    var i;
  
    inStream = coerceInputStream(inStream);
    // if we know the size, write it; otherwise we need to use the 'eos' property
    var fileSize;
    if ('size' in inStream && inStream.size >= 0) {
      fileSize = inStream.size;
    } else {
      fileSize = -1;
      encoder.setEndMarkerMode(true);
    }
  
    outStream = coerceOutputStream(outStream);
  
    encoder.writeCoderProperties(outStream);
  
    var out64 = function(s) {
      // supports up to 53-bit integers
      var i;
      for (i=0;i<8;i++) {
        outStream.writeByte(s & 0xFF);
        s = Math.floor(s/256);
      }
    };
    out64(fileSize);
  
    encoder.code(inStream, outStream, fileSize, -1, {
      setProgress: function(inSize, outSize) {
        if (progress) { progress(inSize, outSize); }
      }
    });
  
    return ('getBuffer' in outStream) ? outStream.getBuffer() : true;
  };