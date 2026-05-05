export function throttle(
  fn: (...args: any[]) => void,
  time: number,
  context = {}
) {
  return function (...args: any[]) {
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
