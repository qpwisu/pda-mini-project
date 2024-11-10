const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


async function fetchNewsBytitle(first_keyword, secondKeyword, page, pageSize) {
  try {
    // URLSearchParams를 사용해 쿼리 파라미터를 동적으로 추가
    const params = new URLSearchParams();
    params.append('first_keyword', first_keyword);
    if (secondKeyword) {
      params.append('second_keyword', secondKeyword); // secondKeyword가 있을 때만 추가
    }
    params.append('page', 1);
    params.append('page_size', 100);

    const res = await fetch(`${API_BASE_URL}/search/title?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
      },
    });
    const data = res.json();
    return data ? data : [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function fetchAutocompleteSuggestions(input) {
  try {
    const res = await fetch(`${API_BASE_URL}/search/autocomplete?prefix=${input}`, {
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

export { fetchNewsBytitle, fetchAutocompleteSuggestions };
