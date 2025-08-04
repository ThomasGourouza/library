export function save<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

export function load<T>(key: string): T | undefined {
  const raw = localStorage.getItem(key);
  return safeParse<T>(raw);
}

export function remove(key: string): void {
  localStorage.removeItem(key);
}

function safeParse<T>(raw: string | null): T | undefined {
  if (raw == null) return undefined;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return undefined;
  }
}
