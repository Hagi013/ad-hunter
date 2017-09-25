export const getItemFromStorage = key => JSON.parse(localStorage.getItem(key));

export const upsertItemToStorage = (key, obj) => localStorage.setItem(key, JSON.stringify(obj));
