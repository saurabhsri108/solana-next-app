export function mergeArrayOfObjects<T>(initialData: Array<T>, newData: Array<T>) {
    const ids = new Set(initialData.map((d: any) => d.id));
    const merged = [...initialData, ...newData.filter((d: any) => !ids.has(d.id))];
    return merged;
};