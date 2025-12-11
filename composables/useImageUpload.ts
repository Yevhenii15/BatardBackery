// composables/useImageUpload.ts
import { ref } from "vue";

export function useImageUpload() {
  const uploading = ref(false);
  const uploadError = ref<string | null>(null);

  const uploadImage = async (file: File, oldUrl?: string) => {
    uploading.value = true;
    uploadError.value = null;

    const formData = new FormData();
    formData.append("file", file);
    if (oldUrl) {
      formData.append("oldUrl", oldUrl);
    }

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || "Upload failed");
      }

      const data = (await res.json()) as { url: string };
      return data.url;
    } catch (err: any) {
      console.error("Upload failed", err);
      uploadError.value = err?.message || "Failed to upload image.";
      throw err;
    } finally {
      uploading.value = false;
    }
  };

  return {
    uploadImage,
    uploading,
    uploadError,
  };
}
