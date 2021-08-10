export default {
  on(el, type, callback) {
    if (el.addEventListener) {
      el.addEventListener(type, callback, { passive: false });
    } else {
      el.attachEvent(`on ${type}`, () => {
        callback.call(el);
      });
    }
  },

  off(el, type, callback) {
    if (el.removeEventListener) {
      el.removeEventListener(type, callback, { passive: false });
    } else {
      el.detachEvent(`off ${type}`, callback);
    }
  },
};
