const BASE_URL = 'http://localhost:8000';

export default async function fetchNewsBytitle(title, page) {
  try {
    const res = await fetch(
      `${BASE_URL}/search/title?first_keyword=${title}&page=${Number(page)}`,
      {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
        },
      }
    );
    return res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}
