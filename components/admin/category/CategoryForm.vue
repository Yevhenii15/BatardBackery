<script setup lang="ts">
import { computed, reactive, watch, ref } from "vue";
import type { Category, CategoryInput } from "~/composables/useCategory";

const props = defineProps<{
  modelValue: Category | null;
}>();

const emit = defineEmits<{
  (e: "submit", payload: CategoryInput): void;
  (e: "cancelEdit"): void;
}>();

const collapsed = ref(false); // collapse toggle

const isEditMode = computed(() => !!props.modelValue);

const emptyState = (): CategoryInput => ({
  categoryName: "",
  weekdayTime: { from: "", to: "" },
  weekendsTime: { from: "", to: "" },
  slotSizeMinutes: 5,
  leadTimeMinutes: 0,
});

const form = reactive<CategoryInput>(emptyState());

const resetForm = () => Object.assign(form, emptyState());

watch(
  () => props.modelValue,
  (val) => {
    if (!val) return resetForm();
    form.categoryName = val.categoryName;
    form.weekdayTime = { ...val.weekdayTime };
    form.weekendsTime = { ...val.weekendsTime };
    form.slotSizeMinutes = val.slotSizeMinutes;
    form.leadTimeMinutes = val.leadTimeMinutes;
  },
  { immediate: true }
);

const onSubmit = () => {
  emit("submit", { ...form });
  resetForm();
};

const onCancel = () => {
  resetForm();
  emit("cancelEdit");
};

const toggle = () => (collapsed.value = !collapsed.value);
</script>

<template>
  <div class="form-container">
    <!-- Header with collapse button -->
    <div class="form-header">
      <h2 class="form-title">
        {{ isEditMode ? "Edit Category" : "Create Category" }}
      </h2>

      <button class="collapse-btn" @click="toggle">
        {{ collapsed ? "Show" : "Hide" }}
        <span class="collapse-icon" :class="{ rotated: collapsed }">▾</span>
      </button>
    </div>

    <!-- Collapsing wrapper -->
    <form v-if="!collapsed" @submit.prevent="onSubmit" class="form-inner">
      <!-- Category Name -->
      <label>Category Name</label>
      <input v-model="form.categoryName" type="text" class="name" required />

      <!-- Weekday -->
      <label>Weekday Time (Mon–Fri)</label>
      <div class="row">
        <input type="time" v-model="form.weekdayTime.from" required />
        <span>to</span>
        <input type="time" v-model="form.weekdayTime.to" required />
      </div>

      <!-- Weekend -->
      <label>Weekend Time (Sat–Sun)</label>
      <div class="row">
        <input type="time" v-model="form.weekendsTime.from" required />
        <span>to</span>
        <input type="time" v-model="form.weekendsTime.to" required />
      </div>

      <!-- Numbers -->
      <div class="row-2">
        <div class="column">
          <label>Slot Size (minutes)</label>
          <input type="number" v-model.number="form.slotSizeMinutes" required />
        </div>

        <div class="column">
          <label>Lead Time (minutes)</label>
          <input type="number" v-model.number="form.leadTimeMinutes" required />
        </div>
      </div>

      <!-- Buttons -->
      <div class="actions">
        <button
          v-if="isEditMode"
          type="button"
          class="btn-cancel"
          @click="onCancel"
        >
          Cancel
        </button>
        <button type="submit" class="btn-submit">
          {{ isEditMode ? "Save Changes" : "Create Category" }}
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
/* Main container */
.form-container {
  margin: 20px 0;
  background: #ffffff;
  padding: 1.6rem 2rem;
  border-radius: 16px;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.15);
  color: #333;
}

/* Header row */
.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Title */
.form-title {
  font-family: Georgia, serif;
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 1.2rem;
  color: #2c2c2c;
}

/* Collapse button */
.collapse-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 999px;
  border: 1px solid #d4d4d4;
  background: #f9fafb;
  cursor: pointer;
  font-size: 0.75rem;
  color: #374151;
  transition: 0.2s ease;
}

.collapse-btn:hover {
  background: #f3f4f6;
}

.collapse-icon {
  transition: transform 0.2s ease;
}

.collapse-icon.rotated {
  transform: rotate(180deg);
}

/* Form layout */
.form-inner {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.name {
  width: 97.8%;
}

/* Rows */
.row {
  display: flex;
  gap: 20px;
  align-items: center;
  width: 100%;
}

.row span {
  color: #666;
  font-size: 15px;
  width: 5%;
}

/* 2 columns */
.row-2 {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
}

@media (max-width: 720px) {
  .row-2 {
    grid-template-columns: 1fr;
  }
}

/* Labels */
label {
  color: #333;
  font-size: 14px;
  margin-bottom: 4px;
  font-weight: 500;
}

/* Inputs */
input {
  background: #f4f4f4;
  border: 1px solid #dcdcdc;
  border-radius: 6px;
  padding: 8px 10px;
  width: 95%;
  font-size: 14px;
  outline: none;
  color: #333;
}

input:focus {
  border-color: #5d7261;
  box-shadow: 0 0 0 2px #5d726155;
}

/* Buttons */
.actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 12px;
}

button {
  cursor: pointer;
  padding: 9px 18px;
  border-radius: 8px;
  font-size: 14px;
  transition: 0.2s ease;
  border: none;
  white-space: nowrap;
}

/* Cancel */
.btn-cancel {
  background: #c94f4f;
  color: white;
}

.btn-cancel:hover {
  background: #a93f3f;
}

/* Submit */
.btn-submit {
  background: #5d7261;
  color: white;
  font-weight: bold;
}

.btn-submit:hover {
  background: #46574a;
}
</style>
