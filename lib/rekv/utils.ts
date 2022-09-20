export function isFunction(fn: any): fn is Function {
  return typeof fn === 'function';
}

export function isPlainObject(obj: any): boolean {
  if (typeof obj !== 'object' || obj === null) return false;

  let proto = obj;
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }
  // proto = null
  return Object.getPrototypeOf(obj) === proto;
}
