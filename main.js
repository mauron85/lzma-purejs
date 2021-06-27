if (typeof define !== 'function') { var define = require('amdefine')(module); }
define(['./lib/amd/freeze', './lib/amd/LZ', './lib/amd/LZMA', './lib/amd/RangeCoder', './lib/amd/Stream', './lib/amd/Util'], function(freeze, LZ, LZMA, RangeCoder, Stream, Util) {
  'use strict';

  return freeze({
        version: "0.9.0",
        LZ: LZ,
        LZMA: LZMA,
        RangeCoder: RangeCoder,
        Stream: Stream,
        Util: Util,
        // utility methods
        compress: Util.compress,
        compressFile: Util.compressFile,
        decompress: Util.decompress,
        decompressFile: Util.decompressFile
  });
});
