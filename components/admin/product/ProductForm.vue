<script setup lang="ts">
import { reactive, watch, computed, ref } from "vue";
import type { Product, ProductInput } from "~/composables/useProduct";
import type { Category } from "~/composables/useCategory";
import { useImageUpload } from "~/composables/useImageUpload";

const props = defineProps<{
  modelValue: Product | null;
  categories: Category[];
}>();

const emit = defineEmits<{
  (e: "submit", payload: ProductInput): void;
  (e: "cancelEdit"): void;
}>();

const isEditMode = computed(() => !!props.modelValue);

// collapsible form
const collapsed = ref(false);

const createEmptyForm = (): ProductInput => ({
  name: "",
  description: "",
  photo: "",
  price: 0,
  categoryId: "",
  stock: 0,
  dailyCapacity: 0,
  active: true,
});

const form = reactive<ProductInput>(createEmptyForm());
const selectedFile = ref<File | null>(null);
const previewUrl = ref<string | null>(null);

// shared image upload composable
const { uploadImage } = useImageUpload();

const resetForm = () => {
  Object.assign(form, createEmptyForm());
  selectedFile.value = null;
  previewUrl.value = null;
};

// sync when editing / switching product
watch(
  () => props.modelValue,
  (val) => {
    if (!val) {
      resetForm();
      return;
    }

    Object.assign(form, val);
    previewUrl.value = val.photo || null;
    selectedFile.value = null;
  },
  { immediate: true }
);

const onSubmit = async () => {
  const payload: ProductInput = { ...form };

  if (selectedFile.value) {
    try {
      const url = await uploadImage(
        selectedFile.value,
        form.photo || undefined
      );
      payload.photo = url;
    } catch (err) {
      alert("Failed to upload image.");
      return;
    }
  }

  emit("submit", payload);
};

const onCancel = () => {
  resetForm();
  emit("cancelEdit");
};

const onFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;
  selectedFile.value = file;
  previewUrl.value = URL.createObjectURL(file);
};

const toggleCollapsed = () => {
  collapsed.value = !collapsed.value;
};
</script>

<template>
  <div class="form-container">
    <!-- Header with collapse toggle -->
    <header class="form-header">
      <h2 class="form-title">
        {{ isEditMode ? "Edit Product" : "Create Product" }}
      </h2>

      <button
        type="button"
        class="collapse-btn"
        @click="collapsed = !collapsed"
      >
        <span>{{ collapsed ? "Show" : "Hide" }}</span>
        <span
          class="collapse-icon"
          :class="{ 'collapse-icon--collapsed': collapsed }"
        >
          ▾
        </span>
      </button>
    </header>

    <!-- Collapsible body -->
    <form v-if="!collapsed" class="form-inner" @submit.prevent="onSubmit">
      <!-- ==== TWO-COLUMN GRID ==== -->
      <div class="form-grid">
        <!-- LEFT COLUMN -->
        <div class="col-left">
          <div class="field">
            <label>Product Name</label>
            <input v-model="form.name" type="text" required />
          </div>

          <div class="field">
            <label>Category</label>
            <select v-model="form.categoryId" required>
              <option disabled value="">Select a category</option>
              <option v-for="cat in categories" :key="cat._id" :value="cat._id">
                {{ cat.categoryName }}
              </option>
            </select>
          </div>

          <div class="field field-image">
            <label>Product Image</label>
            <input type="file" accept="image/*" @change="onFileChange" />

            <div class="image-preview">
              <img v-if="previewUrl" :src="previewUrl" alt="Preview" />
              <img v-else-if="form.photo" :src="form.photo" alt="Preview" />
              <div v-else class="no-image">No image</div>
            </div>
          </div>

          <div class="field">
            <label>Stock</label>
            <input v-model.number="form.stock" type="number" min="0" required />
          </div>
        </div>

        <!-- RIGHT COLUMN -->
        <div class="col-right">
          <div class="field field-description">
            <label>Description</label>
            <textarea
              v-model="form.description"
              rows="4"
              placeholder="Product description"
            />
          </div>

          <div class="field">
            <label>Price (DKK)</label>
            <input
              v-model.number="form.price"
              type="number"
              min="0"
              step="0.5"
              required
            />
          </div>

          <div class="field">
            <label>Daily Capacity</label>
            <input
              v-model.number="form.dailyCapacity"
              type="number"
              min="0"
              required
            />
          </div>
        </div>
      </div>

      <!-- Active -->
      <div class="checkbox-wrap">
        <label>
          <input type="checkbox" v-model="form.active" />
          Active (visible to customers)
        </label>
      </div>

      <!-- Actions -->
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
          {{ isEditMode ? "Save Changes" : "Create Product" }}
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
/* Main container: full width of parent */
.form-container {
  margin: 20px 0;
  background: #ffffff;
  padding: 1.6rem 2rem;
  border-radius: 16px;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.15);
  color: #333;
}

/* Header with title + collapse button */
.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.8rem;
}

/* Title */
.form-title {
  font-family: Georgia, serif;
  font-size: 22px;
  font-weight: bold;
  text-align: left;
  color: #2c2c2c;
}

/* Collapse button */
.collapse-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px solid #d4d4d4;
  background: #f9fafb;
  font-size: 0.75rem;
  cursor: pointer;
  color: #374151;
}

.collapse-btn:hover {
  background: #f3f4f6;
}

.collapse-icon {
  font-size: 0.75rem;
  transition: transform 0.2s ease;
}

.collapse-icon--collapsed {
  transform: rotate(180deg);
}

/* Layout */
.form-inner {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

/* === GRID for left/right === */
.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr)); /* equal columns */
  gap: 1.5rem;
}

.col-left,
.col-right {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 10px;
}

/* Stack on small screens */
@media (max-width: 720px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
}

/* Fields */
.field {
  display: flex;
  flex-direction: column;
}

/* Labels */
label {
  color: #333;
  font-size: 14px;
  margin-bottom: 4px;
  font-weight: 500;
}

/* Inputs */
input,
textarea {
  background: #f4f4f4;
  border: 1px solid #dcdcdc;
  border-radius: 6px;
  padding: 8px 10px;
  width: 95%; 
  font-size: 14px;
  outline: none;
  color: #333;
}
select {
  background: #f4f4f4;
  border: 1px solid #dcdcdc;
  border-radius: 6px;
  padding: 8px 10px;
  width: 100%; 
  font-size: 14px;
  outline: none;
  color: #333;
}

input:focus,
select:focus,
textarea:focus {
  border-color: #5d7261;
  box-shadow: 0 0 0 2px #5d726155;
}

.field-description textarea {
  min-height: 150px;
  resize: vertical;
}

/* Image field */
.field-image input[type="file"] {
  margin-bottom: 6px;
}

/* Image preview */
.image-preview {
  margin-top: 2px;
  width: 110px;
  height: 110px;
  border-radius: 8px;
  background: #eaeaea;
  border: 1px solid #dcdcdc;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.no-image {
  color: #666;
  font-size: 11px;
  text-align: center;
}

/* Checkbox */
.checkbox-wrap {
  margin-top: 6px;
  display: flex;
  align-items: center;
}

.checkbox-wrap label {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #333;
}

/* Buttons */
.actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 10px;
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

/* Cancel button */
.btn-cancel {
  background: #c94f4f;
  color: white;
}

.btn-cancel:hover {
  background: #a93f3f;
}

/* Submit button */
.btn-submit {
  background: #5d7261;
  color: white;
  font-weight: bold;
}

.btn-submit:hover {
  background: #46574a;
}
</style>
