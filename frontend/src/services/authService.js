const API_URL = "http://localhost:8000"; // La URL de tu FastAPI


export const loginUser = async (username, password) => {
  // FastAPI por defecto espera los datos de OAuth2PasswordRequestForm en formato x-www-form-urlencoded
  const formData = new URLSearchParams();
  formData.append("username", username);
  formData.append("password", password);
    const response = await fetch(`${API_URL}/api/v1/auth/login`, { 
  //const response = await fetch(`${API_URL}/token`, { // Ajusta la ruta según tu endpoint de login en FastAPI
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Credenciales inválidas o error en el servidor");
  }

  const data = await response.json();
  return data; // Aquí debería venir el access_token
};

export const getUserRoleFromToken = (token) => {
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