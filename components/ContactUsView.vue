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

      <form class="contact-form">
        <div class="row">
          <input type="text" placeholder="Fornavn*" />
          <input type="text" placeholder="Efternavn*" />
        </div>

        <div class="row">
          <input type="email" placeholder="Email*" />
          <input type="text" placeholder="Emne*" />
        </div>

        <textarea placeholder="Besked"></textarea>

        <button type="submit" class="send-btn">SEND</button>
      </form>
    </div>

    <!-- RIGHT SIDE (Order Panel) -->
    <div class="contact-right">
      <h2 class="order-title">ORDER OUR PASTRY<br />ONLINE</h2>
      <p class="order-subtitle">THEN PICK UP DIRECTLY IN OUR STORE</p>

      <NuxtLink to="/products" class="order-btn"
        >ORDER - VEJERS STRAND</NuxtLink
      >
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
  width: 40%;
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

/* ————————————————
   RIGHT SIDE
——————————————— */
.contact-right {
  width: 60%;
  background: #707f78; /* green-grey Batard color */
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

/* button */
.order-btn {
  margin-top: 3rem;
  width: fit-content;
  background: white;
  color: #000;
  border: none;
  padding: 1rem 2.5rem;
  font-size: 1.2rem;
  font-weight: 700;
  cursor: pointer;
  transition: 0.3s ease;
  text-decoration: none;
}

.order-btn:hover {
  transform: scale(1.07);
}

/* ————————————————
   MOBILE
——————————————— */
@media (max-width: 900px) {
  .contact-section {
    flex-direction: column;
  }

  .contact-left,
  .contact-right {
    width: 100%;
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
