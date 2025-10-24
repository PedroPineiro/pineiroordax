import axios from "axios";

const API_URL = "http://localhost:3000/noticias";

// 🔹 Obtener todas las noticias
export const getNoticias = () => axios.get(API_URL).then((res) => res.data);

// 🔹 Agregar noticia
export const addNoticia = (nuevaNoticia) =>
  axios.post(API_URL, nuevaNoticia).then((res) => res.data);

// 🔹 Eliminar noticia
export const deleteNoticia = (id) =>
  axios.delete(`${API_URL}/${id}`).then((res) => res.data);

// 🔹 Actualizar noticia
export const updateNoticia = (id, noticiaActualizada) =>
  axios.put(`${API_URL}/${id}`, noticiaActualizada).then((res) => res.data);
