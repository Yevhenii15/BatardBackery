<script setup lang="ts">
import { reactive, watch, ref, computed } from "vue";
import type { ContactInfo } from "~/composables/useContactInfo";
import { useImageUpload } from "~/composables/useImageUpload";

const props = defineProps<{
  contactInfo: ContactInfo | null;
  loading: boolean;
  error: string | null;
}>();

const emit = defineEmits<{
  (e: "submit", payload: ContactInfo): void;
}>();

// collapsible (like other admin forms)
const collapsed = ref(false);
const isLoaded = computed(() => !!props.contactInfo);

// local form state
const form = reactive<ContactInfo>({
  email: "",
  phone: "",
  address: "",
  openingHours: "",
  cvr: "",
  logoLight: "",
  logoDark: "",
});

// logo upload state
const selectedLogoLight = ref<File | null>(null);
const selectedLogoDark = ref<File | null>(null);

const previewLogoLight = ref<string | null>(null);
const previewLogoDark = ref<string | null>(null);

const { uploadImage } = useImageUpload();

// sync form with incoming contactInfo
watch(
  () => props.contactInfo,
  (val) => {
    if (!val) return;

    form.email = val.email ?? "";
    form.phone = val.phone ?? "";
    form.address = val.address ?? "";
    form.openingHours = val.openingHours ?? "";
    form.cvr = val.cvr ?? "";
    form.logoLight = val.logoLight ?? "";
    form.logoDark = val.logoDark ?? "";

    previewLogoLight.value = form.logoLight || null;
    previewLogoDark.value = form.logoDark || null;

    selectedLogoLight.value = null;
    selectedLogoDark.value = null;
  },
  { immediate: true }
);

const onSubmit = async () => {
  const payload: ContactInfo = {
    email: form.email,
    phone: form.phone,
    address: form.address,
    openingHours: form.openingHours,
    cvr: form.cvr,
    logoLight: form.logoLight,
    logoDark: form.logoDark,
  };

  try {
    // upload light logo (for dark backgrounds)
    if (selectedLogoLight.value) {
      const urlLight = await uploadImage(
        selectedLogoLight.value,
        form.logoLight || undefined
      );
      payload.logoLight = urlLight;
    }

    // upload dark logo (for light backgrounds)
    if (selectedLogoDark.value) {
      const urlDark = await uploadImage(
        selectedLogoDark.value,
        form.logoDark || undefined
      );
      payload.logoDark = urlDark;
    }
  } catch (err) {
    alert("Failed to upload logo(s).");
    return;
  }

  emit("submit", payload);
};

const onLogoLightChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  selectedLogoLight.value = file;
  previewLogoLight.value = URL.createObjectURL(file);
};

const onLogoDarkChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  selectedLogoDark.value = file;
  previewLogoDark.value = URL.createObjectURL(file);
};

const toggle = () => {
  collapsed.value = !collapsed.value;
};
</script>

<template>
  <div class="form-container">
    <!-- Header with collapse -->
    <div class="form-header">
      <h2 class="form-title">Contact information</h2>

      <button class="collapse-btn" type="button" @click="toggle">
        {{ collapsed ? "Show" : "Hide" }}
        <span class="collapse-icon" :class="{ rotated: collapsed }">▾</span>
      </button>
    </div>

    <!-- Error / loading -->
    <p v-if="error" class="error-text">{{ error }}</p>
    <p v-if="loading && !isLoaded" class="loading-text">
      Loading contact information…
    </p>

    <!-- Form -->
    <form v-if="!collapsed" class="form-inner" @submit.prevent="onSubmit">
      <!-- GRID: two equal columns -->
      <div class="form-grid">
        <!-- LEFT column -->
        <div class="col-left">
          <div class="field">
            <label>Email</label>
            <input
              v-model="form.email"
              type="email"
              placeholder="hello@batardbakery.dk"
              required
            />
          </div>

          <div class="field">
            <label>Phone</label>
            <input
              v-model="form.phone"
              type="text"
              placeholder="+45 29 25 03 80"
              required
            />
          </div>

          <div class="field">
            <label>CVR</label>
            <input
              v-model="form.cvr"
              type="text"
              placeholder="43368532"
              required
            />
          </div>
        </div>

        <!-- RIGHT column -->
        <div class="col-right">
          <div class="field">
            <label>Address</label>
            <textarea
              v-model="form.address"
              rows="2"
              placeholder="Vejers Havvej 81B 6853 Vejers Strand"
              required
            />
          </div>

          <div class="field">
            <label>Opening hours</label>
            <textarea
              v-model="form.openingHours"
              rows="2"
              placeholder="Mon–Fri 08:00–17:00, Sat 09:00–13:00"
              required
            />
          </div>
        </div>
      </div>

      <!-- Logos upload row -->
      <div class="logo-row">
        <!-- Light logo (for dark backgrounds) -->
        <div class="field field-logo">
          <label>Logo for dark background (light logo)</label>
          <input type="file" accept="image/*" @change="onLogoLightChange" />

          <div class="image-preview">
            <img
              v-if="previewLogoLight"
              :src="previewLogoLight"
              alt="Light logo"
            />
            <div v-else class="no-image">No light logo</div>
          </div>

          <p class="hint">Used on dark navbar. SVG or PNG recommended.</p>
        </div>

        <!-- Dark logo (for light backgrounds) -->
        <div class="field field-logo">
          <label>Logo for light background (dark logo)</label>
          <input type="file" accept="image/*" @change="onLogoDarkChange" />

          <div class="image-preview">
            <img
              v-if="previewLogoDark"
              :src="previewLogoDark"
              alt="Dark logo"
            />
            <div v-else class="no-image">No dark logo</div>
          </div>

          <p class="hint">Used on white backgrounds (e.g. footer).</p>
        </div>
      </div>

      <!-- Actions -->
      <div class="actions">
        <button
          type="submit"
          class="btn-submit"
          :disabled="loading || !isLoaded"
        >
          {{ loading ? "Saving…" : "Update contact information" }}
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

/* Header */
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
  margin: 0;
  color: #2c2c2c;
}

/* Collapse button */
.collapse-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 10px;
  font-size: 13px;
  border-radius: 999px;
  border: 1px solid #d1d5db;
  background: #f9fafb;
  cursor: pointer;
  transition: 0.15s ease;
}

.collapse-btn:hover {
  background: #eef2f7;
}

.collapse-icon {
  display: inline-block;
  transition: transform 0.2s ease;
}

.collapse-icon.rotated {
  transform: rotate(180deg);
}

/* Status text */
.error-text {
  color: #b91c1c;
  font-size: 0.85rem;
  margin-bottom: 0.3rem;
}

.loading-text {
  color: #6b7280;
  font-size: 0.85rem;
  margin-bottom: 0.5rem;
}

/* Form layout */
.form-inner {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Grid for main fields */
.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.5rem;
}

.col-left,
.col-right {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

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

label {
  color: #333;
  font-size: 14px;
  margin-bottom: 4px;
  font-weight: 500;
}

input,
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

textarea {
  resize: vertical;
}

/* Logo row */
.logo-row {
  margin-top: 4px;
}

.field-logo input[type="file"] {
  margin-bottom: 6px;
}

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
  object-fit: contain;
}

.no-image {
  color: #666;
  font-size: 11px;
  text-align: center;
}

.hint {
  margin-top: 4px;
  font-size: 0.75rem;
  color: #6b7280;
}

/* Actions */
.actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
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

.btn-submit:hover {
  background: #46574a;
}

.btn-submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>
