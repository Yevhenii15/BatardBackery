<script setup lang="ts">
import { reactive, watch, ref, computed } from "vue";
import type { HeroSection } from "~/composables/useHero";
import { useImageUpload } from "~/composables/useImageUpload";

const props = defineProps<{
  hero: HeroSection | null;
  loading: boolean;
  error: string | null;
}>();

const emit = defineEmits<{
  (e: "submit", payload: HeroSection): void;
}>();

const collapsed = ref(false);
const isLoaded = computed(() => !!props.hero);

// local form state for hero section
const form = reactive<HeroSection>({
  title: "",
  subTitle: "",
  heroImg1: "",
  heroImg2: "",
});

// image upload state
const selectedPrimary = ref<File | null>(null);
const selectedSecondary = ref<File | null>(null);
const previewPrimary = ref<string | null>(null);
const previewSecondary = ref<string | null>(null);

const { uploadImage } = useImageUpload();

// sync with backend hero data
watch(
  () => props.hero,
  (val) => {
    if (!val) return;

    form.title = val.title ?? "";
    form.subTitle = val.subTitle ?? "";
    form.heroImg1 = val.heroImg1 ?? "";
    form.heroImg2 = val.heroImg2 ?? "";

    previewPrimary.value = form.heroImg1 || null;
    previewSecondary.value = form.heroImg2 || null;

    selectedPrimary.value = null;
    selectedSecondary.value = null;
  },
  { immediate: true }
);

const onSubmit = async () => {
  const payload: HeroSection = {
    title: form.title,
    subTitle: form.subTitle,
    heroImg1: form.heroImg1,
    heroImg2: form.heroImg2,
  };

  try {
    // Upload primary image if changed
    if (selectedPrimary.value) {
      const url = await uploadImage(
        selectedPrimary.value,
        form.heroImg1 || undefined
      );
      payload.heroImg1 = url;
    }

    // Upload secondary image if changed
    if (selectedSecondary.value) {
      const url = await uploadImage(
        selectedSecondary.value,
        form.heroImg2 || undefined
      );
      payload.heroImg2 = url;
    }
  } catch (err) {
    alert("Failed to upload hero images.");
    return;
  }

  emit("submit", payload);
};

const onPrimaryChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;
  selectedPrimary.value = file;
  previewPrimary.value = URL.createObjectURL(file);
};

const onSecondaryChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;
  selectedSecondary.value = file;
  previewSecondary.value = URL.createObjectURL(file);
};

const toggle = () => {
  collapsed.value = !collapsed.value;
};
</script>

<template>
  <div class="form-container">
    <!-- Header with collapse -->
    <div class="form-header">
      <h2 class="form-title">Hero section</h2>

      <button class="collapse-btn" type="button" @click="toggle">
        {{ collapsed ? "Show" : "Hide" }}
        <span class="collapse-icon" :class="{ rotated: collapsed }">▾</span>
      </button>
    </div>

    <!-- Error / loading -->
    <p v-if="error" class="error-text">{{ error }}</p>
    <p v-if="loading && !isLoaded" class="loading-text">
      Loading hero section…
    </p>

    <!-- Form -->
    <form v-if="!collapsed" class="form-inner" @submit.prevent="onSubmit">
      <!-- Title -->
      <div class="field">
        <label>Title</label>
        <input
          v-model="form.title"
          type="text"
          placeholder="Example: Freshly baked, every morning"
          required
        />
      </div>

      <!-- Subtitle -->
      <div class="field">
        <label>Subtitle</label>
        <textarea
          v-model="form.subTitle"
          rows="2"
          placeholder="Short supporting text for the hero section"
          required
        />
      </div>

      <!-- Images row -->
      <div class="images-row">
        <!-- Primary image -->
        <div class="image-column">
          <label>Primary image</label>
          <input type="file" accept="image/*" @change="onPrimaryChange" />

          <div class="image-preview">
            <img v-if="previewPrimary" :src="previewPrimary" alt="Primary" />
            <div v-else class="no-image">No image</div>
          </div>

          <p class="hint">Main hero image (larger).</p>
        </div>

        <!-- Secondary image -->
        <div class="image-column">
          <label>Secondary image</label>
          <input type="file" accept="image/*" @change="onSecondaryChange" />

          <div class="image-preview">
            <img
              v-if="previewSecondary"
              :src="previewSecondary"
              alt="Secondary"
            />
            <div v-else class="no-image">No image</div>
          </div>

          <p class="hint">Optional supporting image.</p>
        </div>
      </div>

      <!-- Actions -->
      <div class="actions">
        <button
          type="submit"
          class="btn-submit"
          :disabled="loading || !isLoaded"
        >
          {{ loading ? "Saving…" : "Update hero section" }}
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.form-container {
  margin: 20px 0;
  background: #ffffff;
  padding: 1.6rem 2rem;
  border-radius: 16px;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.15);
  color: #333;
}

/* Header + collapse */
.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.8rem;
}

.form-title {
  font-family: Georgia, serif;
  font-size: 22px;
  font-weight: bold;
  color: #2c2c2c;
}

/* Collapse button */
.collapse-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 999px;
  border: 1px solid #d1d5db;
  background: #f9fafb;
  font-size: 0.8rem;
  cursor: pointer;
  color: #374151;
}

.collapse-btn:hover {
  background: #f3f4f6;
}

.collapse-icon {
  display: inline-block;
  transition: transform 0.2s ease;
}

.collapse-icon.rotated {
  transform: rotate(180deg);
}

/* Layout */
.form-inner {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Error / loading */
.error-text {
  color: #b91c1c;
  font-size: 0.85rem;
  margin-bottom: 0.5rem;
}

.loading-text {
  font-size: 0.85rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
}

/* Fields */
.field {
  display: flex;
  flex-direction: column;
}

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
  width: 100%;
  font-size: 14px;
  outline: none;
  color: #333;
}
textarea {
  background: #f4f4f4;
  border: 1px solid #dcdcdc;
  border-radius: 6px;
  padding: 8px 10px;
  width: 100%;
  font-size: 14px;
  outline: none;
  color: #333;
  height: auto;
}
input:focus,
textarea:focus {
  border-color: #5d7261;
  box-shadow: 0 0 0 2px #5d726155;
}

/* Images layout */
.images-row {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
}

@media (max-width: 720px) {
  .images-row {
    grid-template-columns: 1fr;
  }
}

.image-column {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

/* Image preview */
.image-preview {
  margin-top: 4px;
  width: 130px;
  height: 130px;
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

.hint {
  font-size: 0.75rem;
  color: #6b7280;
}

/* Actions */
.actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
}

.btn-submit {
  cursor: pointer;
  padding: 9px 18px;
  border-radius: 8px;
  font-size: 14px;
  transition: 0.2s ease;
  border: none;
  white-space: nowrap;
  background: #5d7261;
  color: white;
  font-weight: bold;
}

.btn-submit:hover:enabled {
  background: #46574a;
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
