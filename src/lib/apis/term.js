const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default async function fetchPopularTerms() {
  try {
    const res = await fetch(`${API_BASE_URL}/terms/top-liked-terms`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
      },
    });
    return res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}
