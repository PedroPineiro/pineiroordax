<template>
  <div class="min-h-screen bg-gray-100 flex flex-col items-center py-8">
    <!-- Encabezado -->
    <div class="w-full bg-blue-500 h-6 mb-8"></div>

    <div class="w-11/12 max-w-3xl bg-white shadow-md p-6 rounded-lg">

      <!-- Formulario -->
      <h2 class="text-xl font-semibold mb-4 text-gray-800">Noticias</h2>

      <div class="mb-4">
        <label class="block font-medium text-gray-700 mb-1">Título:</label>
        <input
          v-model="titulo"
          type="text"
          class="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
        />
      </div>

      <div class="mb-4">
        <label class="block font-medium text-gray-700 mb-1">Contenido:</label>
        <textarea
          v-model="contenido"
          rows="3"
          class="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
          placeholder="Escribe el contenido de la noticia aquí..."
        ></textarea>
      </div>

    </div>
  </div>
</template>

<script setup>

</script>

<style scoped>
textarea {
  resize: none;
}
</style>
