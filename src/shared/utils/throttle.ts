export function throttle(fn: Function, time: number, context = {}) {
  return function (...args) {
    let inThrottle = false;
    if (!inThrottle) {
      fn.apply(context, args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, time);
    }
  };
}
