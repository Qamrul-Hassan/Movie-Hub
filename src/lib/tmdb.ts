export async function fetchFromTMDB(endpoint: string) {
  const res = await fetch(
    `https://api.themoviedb.org/3${endpoint}&api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
  );

  if (!res.ok) {
    throw new Error(`TMDB API error: ${res.status}`);
  }

  return res.json();
}
