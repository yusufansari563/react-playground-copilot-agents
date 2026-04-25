export function debounce(fn: Function, time: number, context = {}) {
  let timer: TimerHandler;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(context, args);
    }, time);
  };
}
