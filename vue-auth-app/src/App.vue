<script setup>
import { ref } from "vue";
import { signIn, getToken, msalInstance, initializeMsal } from "./authService";
import Header from "./components/Header.vue";
import DideRoller from "./components/DideRoller.vue";


const isAuthenticated = ref(false);
const user = ref({ name: "", email: "" });

const login = async () => {
  try {
    const loginResponse = await signIn();
    if (loginResponse) {
      isAuthenticated.value = true;
      const account = msalInstance.getAllAccounts()[0];
      user.value.name = account.name;
      user.value.email = account.username;
    }
  } catch (error) {
    console.error("Login process failed.", error);
  }
};

const initializeApp = async () => {
  try {
    await initializeMsal(); 
    const accounts = msalInstance.getAllAccounts();
    if (accounts.length > 0) {
      isAuthenticated.value = true;
      const account = accounts[0];
      user.value.name = account.name;
      user.value.email = account.username;
      const token = await getToken();
      if (!token) {
        console.log("No token acquired, but user is logged in.");
      }
    } else {
      console.log("No user is logged in.");
    }
  } catch (error) {
    console.error("Error initializing app.", error);
  }
};

initializeApp();
</script>

<template>
  <div>
    <Header />
    <main>
      <h1>Welcome to the App</h1>
      <p>This is your Vue SPA with Entra Auth.</p>
      <DideRoller />
    </main>
  </div>
</template>


<style>
main {
  padding: 2rem;
}
</style>