<script setup>
import { useCartPanel } from "~/composables/useCartPanel";
const { isOpen } = useCartPanel();
useHead({
  link: [{ rel: "icon", type: "image/png", href: "/img/logoTAB.png" }],
});
</script>

<template>
  <NuxtLayout>
    <NuxtPage />

    <!-- Global cart panel -->
    <CartPanel v-if="isOpen" />
  </NuxtLayout>
</template>
