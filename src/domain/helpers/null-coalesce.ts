type NonUndefined<T> = T extends undefined ? never : T;
export function nullCoalesce<T>(data: T): NonUndefined<T> | null {
  if (data) return data as NonUndefined<T>;
  return null;
}
