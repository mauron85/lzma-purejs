  // Object.freeze(), or a thunk if that method is not present in this
  // JavaScript environment.
export default (() => {
  if (Object.freeze) {
    return Object.freeze;
  } else {
    return function(o) { return o; };
  }
})();
