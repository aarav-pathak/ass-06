const BASE_URL = import.meta.env.VITE_API_URL || "https://ass-06.onrender.com/api";

function get_headers(extra = {}) {
  const headers = { "Content-Type": "application/json", ...extra };
  const token = localStorage.getItem("token");
  if (token) {
    headers["Authorization"] = "Bearer " + token;
  }
  return headers;
}

async function handle_response(res) {
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(json.message || "An unexpected error occurred.");
    err.status = res.status;
    err.data = json;
    throw err;
  }
  return json;
}

function build_url(path, params) {
  const url = new URL(BASE_URL + path);
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") {
        url.searchParams.set(k, v);
      }
    });
  }
  return url.toString();
}

const client = {
  get(path, params) {
    return fetch(build_url(path, params), {
      method: "GET",
      headers: get_headers(),
    }).then(handle_response);
  },

  post(path, body) {
    return fetch(build_url(path), {
      method: "POST",
      headers: get_headers(),
      body: JSON.stringify(body),
    }).then(handle_response);
  },

  put(path, body) {
    return fetch(build_url(path), {
      method: "PUT",
      headers: get_headers(),
      body: JSON.stringify(body),
    }).then(handle_response);
  },

  delete(path) {
    return fetch(build_url(path), {
      method: "DELETE",
      headers: get_headers(),
    }).then(handle_response);
  },
};

export default client;
