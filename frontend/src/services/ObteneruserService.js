const API_URL = "http://localhost:3000/api/users";

export const userService = {
  getById: async (id) => {
    const res = await fetch(`${API_URL}/${id}`, {
      headers: { "x-access-token": localStorage.getItem("token") }
    });
    if (!res.ok) throw new Error("Usuario no encontrado");
    const data = await res.json();
    return data.user; // Ajusta si tu backend responde diferente
  }
};