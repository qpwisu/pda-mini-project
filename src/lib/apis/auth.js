// const BASE_URI = 'http://localhost:3000/api';
const BASE_URI = '/api';

export async function serverLogin({ email, password }) {
  try {
    const res = await fetch(`${BASE_URI}/users/login`, {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return await res.json();
  } catch (err) {
    console.error(err);
    return {};
  }
}

export async function serverLogout() {
  const res = await fetch(`${BASE_URI}/users/logout`);
  return await res.json();
}
