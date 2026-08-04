const KEY = 'shayari-favorites';

export function getFavorites(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]');
  } catch {
    return [];
  }
}

export function isFavorite(id: string): boolean {
  return getFavorites().includes(id);
}

export function toggleFavorite(id: string): boolean {
  const favs = getFavorites();
  const idx = favs.indexOf(id);
  if (idx >= 0) {
    favs.splice(idx, 1);
  } else {
    favs.push(id);
  }
  localStorage.setItem(KEY, JSON.stringify(favs));
  return favs.includes(id);
}

const LIKED_KEY = 'shayari-liked';

export function hasLiked(id: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const liked: string[] = JSON.parse(localStorage.getItem(LIKED_KEY) || '[]');
    return liked.includes(id);
  } catch {
    return false;
  }
}

export function setLiked(id: string, liked: boolean) {
  const stored: string[] = JSON.parse(localStorage.getItem(LIKED_KEY) || '[]');
  const set = new Set(stored);
  if (liked) set.add(id);
  else set.delete(id);
  localStorage.setItem(LIKED_KEY, JSON.stringify(Array.from(set)));
}
