import freeze from './freeze';
import BitTreeDecoder from './RangeCoder/BitTreeDecoder';
import BitTreeEncoder from './RangeCoder/BitTreeEncoder';
import Decoder from './RangeCoder/Decoder';
import Encoder from './RangeCoder/Encoder';
  
export default freeze({
  BitTreeDecoder: BitTreeDecoder,
  BitTreeEncoder: BitTreeEncoder,
  Decoder: Decoder,
  Encoder: Encoder
});
