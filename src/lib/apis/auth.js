const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function serverLogin({ email, password }) {
  try {
    const res = await fetch(`${API_BASE_URL}/users/login`, {
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
