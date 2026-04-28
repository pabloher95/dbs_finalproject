type LocalStorageShape = {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
  clear: () => void;
  key: (index: number) => string | null;
  length: number;
};

function createMemoryStorage(): LocalStorageShape {
  const store = new Map<string, string>();

  return {
    get length() {
      return store.size;
    },
    getItem(key) {
      return store.has(key) ? store.get(key)! : null;
    },
    setItem(key, value) {
      store.set(String(key), String(value));
    },
    removeItem(key) {
      store.delete(String(key));
    },
    clear() {
      store.clear();
    },
    key(index) {
      return Array.from(store.keys())[index] ?? null;
    }
  };
}

if (typeof window === "undefined") {
  const current = globalThis.localStorage as Partial<LocalStorageShape> | undefined;
  if (!current || typeof current.getItem !== "function") {
    Object.defineProperty(globalThis, "localStorage", {
      value: createMemoryStorage(),
      configurable: true
    });
  }
}
