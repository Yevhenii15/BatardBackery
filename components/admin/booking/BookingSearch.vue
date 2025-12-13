<template>
  <div class="search-bar">
    <input
      v-model="search"
      type="text"
      placeholder="Enter booking ID or number"
      class="search-input"
    />

    <button @click="onSearch" class="btn">Search</button>

    <button v-if="search" @click="onReset" class="btn btn-reset">Reset</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const search = ref("");

const emit = defineEmits(["search", "reset"]);

// Search
const onSearch = () => {
  if (!search.value) return;
  emit("search", search.value.trim());
};

// Reset
const onReset = () => {
  search.value = "";
  emit("reset"); 
};
</script>
<style scoped>
.search-bar {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.search-input {
  border: 1px solid #d1d5db;
  border-radius: 10px;
  padding: 0.55rem 0.75rem;
  font-size: 0.85rem;
  width: 260px;
  background: #ffffff;
  transition: 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: #111827;
  box-shadow: 0 0 0 2px rgba(17, 24, 39, 0.15);
}

.btn {
  padding: 0.55rem 1rem;
  font-size: 0.8rem;
  border-radius: 10px;
  border: 1px solid #111827;
  background: white;
  cursor: pointer;
  transition: 0.2s;
}

.btn:hover {
  background: #111827;
  color: white;
}

.btn-reset {
  border-color: #9ca3af;
  color: #555;
}

.btn-reset:hover {
  background: #f3f4f6;
  color: #111;
}
</style>
