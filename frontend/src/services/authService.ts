const API_URL = "http://localhost:8000"; // FastApi URL


export const loginUser = async (username: string, password: string) => {
  // FastAPI expects form data for login, so we need to send it in the correct format
  const formData = new URLSearchParams();
  formData.append("username", username);
  formData.append("password", password);
    const response = await fetch(`${API_URL}/api/v1/auth/login`, { // Ajust the endpoint to match your FastAPI route
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Invalid credentials or connection error with FastAPI");
  }

  const data = await response.json();
  return data; // Return access_token and token_type
};

export const getUserRoleFromToken = (token: string): string | null => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    const decoded = JSON.parse(jsonPayload);
    return decoded.role; // Retorna 'admin' o 'user'
  } catch (error) {
    return null;
  }
};