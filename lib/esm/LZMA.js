import freeze from './freeze';
import Decoder from './LZMA/Decoder';
import Encoder from './LZMA/Encoder';
  
export default freeze({
  Decoder: Decoder,
  Encoder: Encoder
});
