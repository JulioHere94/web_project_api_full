const API_BASE_URL = "http://localhost:3000"; // URL do backend

export const api = {
  getUserInfo: async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`, // Certifique-se de que o token está correto
      },
    });
    return response.json();
  },
  getInitialCards: async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/cards`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  },
  addCard: async (cardData) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/cards`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(cardData),
    });
    return response.json();
  },
  toggleLike: async (cardId, isLiked) => {
    const token = localStorage.getItem("token");
    const method = isLiked ? "PUT" : "DELETE";
    const response = await fetch(`${API_BASE_URL}/cards/${cardId}/likes`, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  },
  deleteCard: async (cardId) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/cards/${cardId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  },
  updateUserInfo: async (userData) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/users/me`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Certifique-se de que o token está correto
      },
      body: JSON.stringify(userData),
    });
    return response.json();
  },
  updateUserAvatar: async (avatarUrl) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/users/me/avatar`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ avatar: avatarUrl }),
    });
    return response.json();
  },
};
