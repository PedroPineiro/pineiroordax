<template>
  <div
    class="container mx-auto mt-2 p-3 my-1 border rounded-0 shadow-sm min-vh-75 bg-light"
  >
    <!-- Título principal -->
    <h2 class="text-center text-primary fw-bold my-4">
      <i class="bi bi-gear"></i>Taller
    </h2>

    <!-- Botón para limpiar formulario -->
    <div class="d-flex justify-content-end mb-1">
      <button
        type="button"
        class="btn border border-primary border-2 rounded-0 text-primary shadow-none mt-2 me-2"
        style="--bs-btn-hover-bg: var(--bs-primary-bg-subtle)"
        @click="limpiarPagina"
        title="Limpiar formulario"
      >
        <i class="bi bi-arrow-counterclockwise"></i>
      </button>
    </div>

    <!-- Formulario para añadir o modificar citas -->
    <form @submit.prevent="guardarCita" class="mb-4">
      <div class="row g-3 align-items-end">
        <!-- Selector de matrícula -->
        <div class="col-md-3 d-flex align-items-center justify-content-end">
          <label for="matricula" class="form-label me-2 mb-0 text-nowrap"
            >Matrícula:</label
          >
          <input
            type="text"
            class="form-control"
            id="matricula"
            pattern="[0-9]{4}[A-Za-z]{3}"
            v-model="nuevaCita.matricula"
            required
          />
        </div>

        <!-- Movil Cliente -->
        <div class="col-md-3 d-flex align-items-center justify-content-end">
          <label for="movilCliente" class="form-label me-2 mb-0 text-nowrap"
            >Movil:</label
          >
          <input
            type="number"
            class="form-control"
            id="movilCliente"
            v-model="nuevaCita.movilCliente"
            required
          />
        </div>

        <div class="col-md-3 d-flex align-items-center justify-content-end">
          <label for="fechaCita" class="form-label me-2 mb-0 text-nowrap"
            >Fecha Cita:</label
          >
          <input
            type="date"
            id="fechaCita"
            v-model="nuevaCita.fechaCita"
            class="form-control"
          />
        </div>

        <div class="col-md-3 d-flex align-items-center justify-content-end">
          <label for="servicioTaller" class="form-label me-2 mb-0 text-nowrap"
            >Servicio:</label
          >
          <select
            id="servicioTaller"
            v-model="nuevaCita.servicioTaller"
            class="form-select"
            required
          >
            <option disabled value="">Seleccione un servicio</option>
            <option
              v-for="option in opcionesServicio"
              :key="option"
              :value="option"
            >
              {{ option }}
            </option>
          </select>
        </div>

        <!-- Estado Cita -->
        <div class="col-md-4 d-flex align-items-center">
          <label>Estado:</label>
          <div class="ms-3">
            <label for="radio-pendiente">Pendiente:</label>
            <input
              type="radio"
              id="radio-pendiente"
              value="pendiente"
              name="radio"
              class="ms-2"
              v-model="nuevaCita.estadoCita"
              checked
              required
            />
          </div>
          <div class="ms-3">
            <label for="radio-finalizado">Finalizado:</label>
            <input
              type="radio"
              id="radio-finalizado"
              value="finalizado"
              name="radio"
              class="ms-2"
              v-model="nuevaCita.estadoCita"
              required
            />
          </div>
        </div>

        <!-- Botón centrado y checkbox al final -->
        <div class="text-center">
          <input
            type="checkbox"
            id="acepta"
            v-model="acepta"
            class="form-check-input"
          />
          <span class="form-check-label ms-3 me-5 mb-0"
            >Aceptar Presupuesto:</span
          >
        </div>

        <!-- Espacio izquierdo para centrar el botón -->
        <div class="flex-grow-1 d-flex justify-content-center">
          <button
            type="submit"
            class="btn btn-primary px-4"
            :disabled="!acepta"
          >
            Guardar
          </button>
        </div>
      </div>
    </form>

    <!-- Tabla que muestra la lista de citas cargados -->
    <table
      class="table table-bordered table-striped table-hover table-sm align-middle table-responsive"
    >
      <thead class="thead-dark table-primary text-center">
        <tr>
          <th>ID</th>
          <th>Matrícula</th>
          <th>Movil Cliente</th>
          <th>Fecha Cita</th>
          <th>Servicio</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="cita in citas" :key="cita.id" class="text-center">
          <td>{{ cita.id }}</td>
          <td>{{ cita.matricula }}</td>
          <td>{{ cita.movilCliente }}</td>
          <td>{{ cita.fechaCita }}</td>
          <td>{{ cita.servicioTaller }}</td>
          <td>{{ cita.estadoCita }}</td>
          <td class="align-middle text-center">
            <!-- Botón para eliminar un cita -->
            <button
              class="btn btn-danger btn-sm border-0 ms-4 me-2 shadow-none rounded-0"
              @click="borrarCita(cita.id)"
            >
              <i class="bi bi-trash"></i>
            </button>

            <!-- Botón para editar un cita -->
            <button
              class="btn btn-warning btn-sm shadow-none rounded-0"
              @click="editarCita(cita.id)"
            >
              <i class="bi bi-pencil"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import Swal from "sweetalert2";
import { getCita, addCita, updateCita, deleteCita } from "@/api/taller.js";

const citas = ref([]);
const nuevaCita = ref({
  matricula: "",
  movilCliente: "",
  fechaCita: "",
  servicioTaller: "",
  estadoCita: "",
  acepta: false,
});

async function cargarCitas() {
  try {
    Swal.fire({
      icon: "success",
      title: "Listando citas...",
      showConfirmButton: false,
      timer: 1500,
    });
    citas.value = await getCita();
  } catch (error) {
    console.error("Fallo al cargar los datos de la bbdd", error);
  }
}

const opcionesServicio = [
  "revision",
  "preITV",
  "neumáticos",
  "frenos",
  "cambio de aceite",
];

const editando = ref(false);
const citaEditandoId = ref("");

onMounted(async () => {
  await cargarCitas();
});

async function guardarCita() {
  if (!acepta.value) {
    Swal.fire({
      icon: "warning",
      title: "Debes aceptar el presupuesto antes de guardar",
      showConfirmButton: false,
      timer: 2000,
    });
    return;
  }

  const result = await Swal.fire({
    title: editando.value
      ? "¿Desea modificar esta cita?"
      : "¿Desea guardar esta cita?",
    icon: "warning",
    showCancelButton: true,
    showConfirmButton: editando.value ? "Modificar" : "Añadir",
    cancelButtonText: "Cancelar",
  });
  if (!result.isConfirmed) {
    return;
  } //el return hace que se pare el método actual

  if (editando.value) {
    const index = citas.value.findIndex(
      (cita) => cita.id === citaEditandoId.value
    );
    if (index !== -1) {
      citas.value[index] = { ...nuevaCita.value };
    }
    try {
      await updateCita(citaEditandoId.value, nuevaCita.value);
      Swal.fire({
        icon: "success",
        title: "cita actualizada exitosamente",
        showConfirmButton: false,
        timer: 1500,
      });
      limpiarPagina();
    } catch (error) {
      console.error("Error al actualizar la cita", error);
      Swal.fire({
        icon: "error",
        title: "Error al actualizar la cita",
        text: "Inténtelo de nuevo más tarde.",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  } else {
    const citaNueva = {
      id: String(citas.value.length > 0 ? citas.value.length + 1 : 1),
      matricula: nuevaCita.value.matricula.toUpperCase(),
      movilCliente: nuevaCita.value.movilCliente,
      fechaCita: nuevaCita.value.fechaCita,
      servicioTaller: nuevaCita.value.servicioTaller,
      estadoCita: nuevaCita.value.estadoCita,
      acepta: nuevaCita.value.acepta,
    };

    try {
      await addCita(citaNueva);
      citas.value.push(citaNueva);
      Swal.fire({
        icon: "success",
        title: "cita agregada exitosamente",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      console.error("Error al agregar la cita", error);
      Swal.fire({
        icon: "error",
        title: "Error al agregar la cita",
        text: "Inténtelo de nuevo más tarde.",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  }
  limpiarPagina();
}

async function borrarCita(id) {
  try {
    const result = await Swal.fire({
      title: "¿Está seguro de que desea eliminar este cita?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) {
      return;
    }

    await deleteCita(id);
    citas.value = citas.value.filter((cita) => cita.id !== id);
    Swal.fire({
      icon: "success",
      title: "cita eliminado exitosamente",
      showConfirmButton: false,
      timer: 1500,
    });
  } catch (error) {
    console.error("Error al eliminar el cita", error);
    Swal.fire({
      icon: "error",
      title: "Error al eliminar el cita",
      text: "Inténtelo de nuevo más tarde.",
      showConfirmButton: false,
      timer: 1500,
    });
  }
}

async function editarCita(id) {
  editando.value = true;
  nuevaCita.value = { ...citas.value.find((cita) => cita.id === id) };
  citaEditandoId.value = id;
}

function limpiarPagina() {
  nuevaCita.value = {
    matricula: "",
    movilCliente: "",
    fechaCita: "",
    servicioTaller: "",
    estadoCita: "",
    acepta: false,
  };
  editando.value = false;
  citaEditandoId.value = "";
}
</script>
