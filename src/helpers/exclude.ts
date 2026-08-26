/**
 * Removes the specified keys from an object or array of objects. (Mutates)
 * @param data The data to be modified (array or object)
 * @param keys The keys to be removed
 */
export function exclude<T, Key extends keyof T>(
  data: T,
  ...keys: Key[]
): Omit<T, Key>;
export function exclude<T, Key extends keyof T>(
  data: T[],
  ...keys: Key[]
): Omit<T, Key>[];
export function exclude<T, Key extends keyof T>(
  data: T | T[],
  ...keys: Key[]
): any {
  if (Array.isArray(data)) {
    data.forEach((item) => {
      for (const key of keys) {
        delete item[key];
      }
    });
  } else {
    for (const key of keys) {
      delete data[key];
    }
  }
  return data;
}
