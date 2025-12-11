<script setup lang="ts">
import { ref } from "vue";
import { useContactMessages } from "~/composables/useContactMessages";

const firstName = ref("");
const lastName = ref("");
const email = ref("");
const subject = ref("");
const message = ref("");

const localError = ref<string | null>(null);
const success = ref<string | null>(null);

const { sendMessage, loading, error } = useContactMessages();

const onSubmit = async () => {
  localError.value = null;
  success.value = null;

  if (
    !firstName.value.trim() ||
    !lastName.value.trim() ||
    !email.value.trim() ||
    !subject.value.trim() ||
    !message.value.trim()
  ) {
    localError.value = "Please fill in all required fields (*).";
    return;
  }

  const payload = {
    firstName: firstName.value.trim(),
    lastName: lastName.value.trim(),
    subject: subject.value.trim(),
    email: email.value.trim(),
    message: message.value.trim(),
  };

  const created = await sendMessage(payload);

  if (!created) {
    localError.value =
      error.value || "Failed to send message. Please try again later.";
    return;
  }

  success.value = "Thank you! Your message has been sent.";

  // Reset fields
  firstName.value = "";
  lastName.value = "";
  email.value = "";
  subject.value = "";
  message.value = "";
};
</script>

<template>
  <section class="contact-section">
    <!-- LEFT SIDE (Form) -->
    <div class="contact-left">
      <h2 class="contact-title">CONTACT US</h2>
      <h3 class="contact-subtitle">
        WE RESPOND TO ALL<br />
        INQUIRIES AS QUICKLY<br />
        AS POSSIBLE
      </h3>

      <form class="contact-form" @submit.prevent="onSubmit">
        <div class="row">
          <input v-model="firstName" type="text" placeholder="First name*" />
          <input v-model="lastName" type="text" placeholder="Last name*" />
        </div>

        <div class="row">
          <input v-model="email" type="email" placeholder="Email*" />
          <input v-model="subject" type="text" placeholder="Subject*" />
        </div>

        <textarea v-model="message" placeholder="Message*"></textarea>

        <button type="submit" class="send-btn" :disabled="loading">
          {{ loading ? "SENDING..." : "SEND" }}
        </button>

        <!-- Errors -->
        <p v-if="localError" class="contact-error">{{ localError }}</p>
        <p v-else-if="error" class="contact-error">{{ error }}</p>

        <!-- Success message -->
        <p v-if="success" class="contact-success">{{ success }}</p>
      </form>
    </div>

    <!-- RIGHT SIDE (Order Panel) -->
    <div class="contact-right">
      <h2 class="order-title">ORDER OUR PASTRY<br />ONLINE</h2>
      <p class="order-subtitle">PICK UP DIRECTLY IN OUR STORE</p>

      <NuxtLink to="/products" class="order-btn">
        ORDER - VEJERS STRAND
      </NuxtLink>
    </div>
  </section>
</template>

<style>
/* ————————————————
   GENERAL LAYOUT
——————————————— */
.contact-section {
  display: flex;
  width: 100%;
  min-height: 100vh;
  overflow: hidden;
}

/* ————————————————
   LEFT SIDE
——————————————— */
.contact-left {
  background: #ebeaea;
  padding: 5rem 4rem;
  color: #231f20;
}

.contact-title {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  letter-spacing: 2px;
}

.contact-subtitle {
  font-size: 1.3rem;
  color: #231f20;
  line-height: 1.4;
  margin-bottom: 3rem;
  font-weight: 300;
}

/* ————————————————
   FORM
——————————————— */
.contact-form {
  max-width: 550px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.row {
  width: 100%;
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

input,
textarea {
  width: 100%;
  padding: 1rem;
  border: 1px solid #9a9a9a;
  background: transparent;
  font-size: 1rem;
  font-family: inherit;
}

textarea {
  width: 93%;
  height: 150px;
  margin-bottom: 1.5rem;
  resize: none;
}

.send-btn {
  background: #6f7d75;
  color: white;
  border: none;
  padding: 0.9rem 3rem;
  font-size: 1.2rem;
  cursor: pointer;
  transition: 0.3s ease;
  margin-top: 1rem;
  align-self: center;
}

.send-btn:hover {
  background: #55625c;
  transform: scale(1.05);
}

.send-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

/* Messages */
.contact-error {
  margin-top: 1rem;
  color: #b91c1c;
  font-size: 0.95rem;
  text-align: center;
}

.contact-success {
  margin-top: 1rem;
  color: #166534;
  font-size: 0.95rem;
  text-align: center;
}

/* ————————————————
   RIGHT SIDE
——————————————— */
.contact-right {
  background: #707f78;
  color: white;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 4rem 2rem;
}

.order-title {
  font-size: 3.8rem;
  font-weight: 300;
  letter-spacing: 2px;
  line-height: 1.2;
}

.order-subtitle {
  margin-top: 1.5rem;
  font-size: 1.2rem;
  letter-spacing: 1px;
  opacity: 0.9;
}

/* Button */
.order-btn {
  margin-top: 3rem;
  background: white;
  color: #000;
  padding: 1rem 2.5rem;
  font-size: 1.2rem;
  font-weight: 700;
  text-decoration: none;
  transition: 0.3s ease;
}

.order-btn:hover {
  transform: scale(1.07);
}

/* ————————————————
   MOBILE
——————————————— */
@media (min-width: 901px) {
  .contact-left {
    width: 40%;
  }
  .contact-right {
    width: 60%;
  }
}
@media (max-width: 900px) {
  .contact-section {
    flex-direction: column;
  }

  .contact-left {
    padding: 3rem 2rem;
  }

  .contact-right {
    padding: 3rem 1.5rem;
  }

  .order-title {
    font-size: 2.4rem;
  }
}
</style>
