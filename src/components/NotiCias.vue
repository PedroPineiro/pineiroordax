<template>
  <div class="bg-light min-vh-100">
    <!-- Franja superior -->
    <div class="bg-primary py-3 mb-4"></div>

    <div class="container">
      <h2 class="text-center text-primary fw-bold my-4"><i class="bi bi-people-fill"></i>Noticias</h2>
      <!-- Formulario -->
      <div class="card shadow-sm mb-4">
        <div class="card-body">
          <div class="mb-3">
            <label for="titulo" class="form-label fw-bold">Título:</label>
            <input
              v-model="titulo"
              type="text"
              id="titulo"
              class="form-control"
              placeholder="Introduce el título"
            />
          </div>

          <div class="mb-3">
            <label for="contenido" class="form-label fw-bold">Contenido:</label>
            <textarea
              v-model="contenido"
              id="contenido"
              rows="4"
              class="form-control"
              placeholder="Escribe el contenido aquí..."
            ></textarea>
          </div>

          <div class="text-center">
            <button
              class="btn btn-link fw-bold text-primary text-uppercase"
              @click="agregarNoticia"
            >
              Publicar
            </button>
          </div>
        </div>
      </div>

      <!-- Lista de noticias -->
      <div v-if="noticias.length > 0" class="mb-4">
        <div class="d-flex justify-content-between align-items-center">
          <h5 class="fw-bold">Noticias</h5>
          <small class="text-muted">Ordenadas por fecha (más recientes primero)</small>
        </div>
        <hr />

        <div
          v-for="noticia in noticiasOrdenadas"
          :key="noticia.id"
          class="card mb-3 shadow-sm border-0"
        >
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <h6 class="fw-bold mb-0">{{ noticia.titulo }}</h6>
              <small class="text-muted">{{ formatFecha(noticia.fecha) }}</small>
            </div>

            <!-- Contenido con truncado -->
            <p class="mb-3">
              {{ textoReducido(noticia) }}
              <button
                v-if="noticia.contenido.length > maxLongitud"
                class="btn btn-sm btn-link p-0 ms-1"
                @click="toggleExpand(noticia.id)"
              >
                {{ expandido[noticia.id] ? "Leer menos" : "Leer más" }}
              </button>
            </p>

            <div class="d-flex gap-2">
              <button
                class="btn btn-sm btn-outline-secondary"
                @click="editarNoticia(noticia)"
              >
                Editar
              </button>
              <button
                class="btn btn-sm btn-outline-danger"
                @click="eliminarNoticia(noticia.id)"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center text-muted py-5">
        <p>No hay noticias disponibles.</p>
      </div>
    </div>

    <!-- Franja inferior -->
    <div class="bg-primary py-3 mt-4"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import {
  getNoticias,
  addNoticia,
  deleteNoticia,
  updateNoticia,
} from "../api/noticias.js";

const noticias = ref([]);
const titulo = ref("");
const contenido = ref("");
const editando = ref(false);
const idEditando = ref(null);
const expandido = ref({}); // Controla qué noticias están desplegadas
const maxLongitud = 180; // Máximo de caracteres antes de truncar

onMounted(async () => {
  noticias.value = await getNoticias();
});

const noticiasOrdenadas = computed(() =>
  [...noticias.value].sort(
    (a, b) => new Date(b.fecha) - new Date(a.fecha)
  )
);

const agregarNoticia = async () => {
  if (!titulo.value.trim() || !contenido.value.trim()) {
    alert("Por favor, rellena todos los campos.");
    return;
  }

  const nuevaNoticia = {
    titulo: titulo.value,
    contenido: contenido.value,
    fecha: new Date().toISOString().split("T")[0],
  };

  if (editando.value) {
    await updateNoticia(idEditando.value, nuevaNoticia);
    const index = noticias.value.findIndex((n) => n.id === idEditando.value);
    noticias.value[index] = { ...nuevaNoticia, id: idEditando.value };
    editando.value = false;
    idEditando.value = null;
  } else {
    const creada = await addNoticia(nuevaNoticia);
    noticias.value.push(creada);
  }

  titulo.value = "";
  contenido.value = "";
};

const eliminarNoticia = async (id) => {
  if (confirm("¿Seguro que quieres eliminar esta noticia?")) {
    await deleteNoticia(id);
    noticias.value = noticias.value.filter((n) => n.id !== id);
  }
};

const editarNoticia = (noticia) => {
  titulo.value = noticia.titulo;
  contenido.value = noticia.contenido;
  idEditando.value = noticia.id;
  editando.value = true;
};

// 🔹 Texto truncado dinámico
const textoReducido = (noticia) => {
  if (expandido.value[noticia.id]) return noticia.contenido;
  if (noticia.contenido.length <= maxLongitud) return noticia.contenido;
  return noticia.contenido.slice(0, maxLongitud) + "...";
};

// 🔹 Alternar "leer más"
const toggleExpand = (id) => {
  expandido.value[id] = !expandido.value[id];
};

// 🔹 Formatear fecha
const formatFecha = (fecha) => {
  const opciones = { year: "numeric", month: "long", day: "numeric" };
  return new Date(fecha).toLocaleDateString("es-ES", opciones);
};
</script>
