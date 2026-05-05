export function debounce(
  fn: (...args: any[]) => void,
  time: number,
  context = {}
) {
  let timer: NodeJS.Timeout | undefined;
  return function (...args: any[]) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(context, args);
    }, time);
  };
}
