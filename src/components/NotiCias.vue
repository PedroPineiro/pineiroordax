<template>
  <div class="bg-light min-vh-100">
    <!-- Franja superior -->
    <div class="bg-primary py-3 mb-4"></div>

    <div class="container">
      <h2 class="text-center text-primary fw-bold my-4">
        <i class="bi bi-newspaper"></i> Noticias
      </h2>

      <!-- Formulario (solo si es admin) -->
      <div v-if="isAdmin" class="card shadow-sm mb-4">
        <div class="card-body">
          <div class="mb-3">
            <label for="titulo" class="form-label fw-bold">Título:</label>
            <input
              v-model="nuevo.titulo"
              type="text"
              id="titulo"
              maxlength="128"
              class="form-control"
              placeholder="Introduce el título (máximo 128 caracteres)"
            />
          </div>

          <div class="mb-3">
            <label for="contenido" class="form-label fw-bold">Contenido:</label>
            <textarea
              v-model="nuevo.contenido"
              id="contenido"
              maxlength="1024"
              rows="4"
              class="form-control"
              placeholder="Escribe el contenido aquí... (máximo 1024 caracteres)"
            ></textarea>
          </div>

          <div class="text-center">
            <button
              class="btn btn-outline-primary btn-sm fw-bold text-uppercase"
              @click="agregarNoticia"
            >
              <i class="bi bi-plus-lg"></i> Publicar
            </button>
          </div>
        </div>
      </div>

      <!-- Lista de noticias -->
      <div v-if="noticias.length > 0" class="mb-4">
        <div class="d-flex justify-content-between align-items-center">
          <h5 class="fw-bold">Últimas Noticias</h5>
          <small class="text-muted"
            >{{ noticias.length }} noticias guardadas</small
          >
        </div>
        <hr />

        <div
          v-for="noticia in noticias"
          :key="noticia.id"
          class="card mb-3 shadow-sm border-0"
        >
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <h6 class="fw-bold mb-0 text-primary">{{ noticia.titulo }}</h6>
              <small class="text-muted">{{ noticia.fecha }}</small>
            </div>

            <!-- Contenido con truncado -->
            <p class="mb-3">
              <span v-if="isExpanded[noticia.id]">{{ noticia.contenido }}</span>
              <span v-else>{{
                noticia.contenido.length > 200
                  ? noticia.contenido.slice(0, 200) + "..."
                  : noticia.contenido
              }}</span>
              <button
                v-if="noticia.contenido.length > 200"
                class="btn btn-sm btn-link p-0 ms-1"
                @click="toggleExpand(noticia.id)"
              >
                {{ isExpanded[noticia.id] ? "Leer menos" : "Leer más" }}
              </button>
            </p>

            <div v-if="isAdmin" class="d-flex gap-2">
              <button
                class="btn btn-sm btn-outline-danger"
                @click="eliminarNoticia(noticia.id)"
              >
                <i class="bi bi-trash"></i> Eliminar
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
import { ref, reactive, onMounted } from "vue";
import {
  getNoticias,
  addNoticia,
  updateNoticia,
  deleteNoticia,
} from "@/api/noticias.js";
import { esAdmin } from "@/api/authApi.js";

// datos cargados desde /api/noticias (server local)
const noticias = ref([]);
const isAdmin = ref(false);

// Formulario
const nuevo = reactive({ titulo: "", contenido: "" });
const editingId = ref(null);

// Control de expansión por id
const isExpanded = reactive({});

const loadNoticias = async () => {
  try {
    noticias.value = await getNoticias();
  } catch (e) {
    console.error("error al cargar noticias", e);
    noticias.value = [];
  }
};

const checkAdmin = async () => {
  try {
    const result = await esAdmin();
    isAdmin.value = result.isAdmin;
  } catch (e) {
    console.error("error verificando admin", e);
    isAdmin.value = false;
  }
};

onMounted(async () => {
  const res = await fetch("http://localhost:3000/noticias");
  noticias.value = await res.json();
  isAdmin.value = sessionStorage.getItem("isAdmin") === "true";
});

const toggleExpand = (id) => {
  isExpanded[id] = !isExpanded[id];
};

const agregarNoticia = async () => {
  if (!nuevo.titulo.trim() || !nuevo.contenido.trim()) return;

  const payload = {
    titulo: nuevo.titulo.trim(),
    contenido: nuevo.contenido.trim(),
    fecha: new Date().toLocaleDateString(),
  };

  try {
    let res, json;
    if (editingId.value) {
      await updateNoticia(editingId.value, payload);
      await loadNoticias();
      editingId.value = null;
    } else {
      const created = await addNoticia(payload);
      noticias.value.unshift(created);
    }

    // reset
    nuevo.titulo = "";
    nuevo.contenido = "";
  } catch (e) {
    console.error("error guardando noticia", e);
  }
};

const limpiarFormulario = () => {
  nuevo.titulo = "";
  nuevo.contenido = "";
  editingId.value = null;
};

const eliminarNoticia = async (id) => {
  try {
    await deleteNoticia(id);
    const idx = noticias.value.findIndex((n) => n.id === id);
    if (idx !== -1) noticias.value.splice(idx, 1);
  } catch (e) {
    console.error("error eliminando noticia", e);
  }
};

const editarNoticia = (id) => {
  const n = noticias.value.find((n) => n.id === id);
  if (!n) return;
  nuevo.titulo = n.titulo;
  nuevo.contenido = n.contenido;
  editingId.value = n.id;
};
</script>

<style scoped>
.bg-primary {
  background-color: #0d6efd !important;
}

.card {
  border-radius: 0.5rem;
  transition: transform 0.2s;
}

.card:hover {
  transform: translateY(-2px);
}

.btn i.bi {
  vertical-align: -0.125em;
}

.btn-link {
  text-decoration: none;
  font-size: 0.9rem;
}

.btn-link:hover {
  text-decoration: underline;
}

p {
  line-height: 1.6;
  word-wrap: break-word;
}
</style>
