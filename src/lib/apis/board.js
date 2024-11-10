const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function fetchBoardList() {
  try {
    const res = await fetch(`${API_BASE_URL}/board`, {
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

export async function fetchBoardDetail(boardId) {
  try {
    const res = await fetch(`${API_BASE_URL}/board/${boardId}`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
      },
    });
    return res.json();
  } catch (error) {
    console.error(error);
    return {};
  }
}
