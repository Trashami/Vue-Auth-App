<template>
  <header class="app-header">
    <div class="container">
      <div class="home-link" @click="goToHome">
        <h2>My Vue App</h2>
      </div>
      <div class="user-actions" v-if="isAuthenticated">
        <div class="user-info" @click="toggleDropdown">
          <img v-if="user.photo" :src="user.photo" alt="Profile" class="profile-pic" />
          <p class="user-name">{{ user.name }}</p>
        </div>
        <div v-if="showDropdown" class="dropdown">
          <div class="dropdown-header">
            <span class="organization-name">County of Tulare</span>
          </div>
          <div class="profile-details">
            <img v-if="user.photo" :src="user.photo" alt="Profile" class="profile-pic-large" />
            <div class="user-info-details">
              <p class="user-full-name">{{ user.name }}</p>
              <p class="user-email">{{ user.email }}</p>
            </div>
          </div>
          <button class="button" @click="loadUserProfile">Settings</button>
          <button @click="logout" class="button">Sign Out</button>
        </div>
      </div>
      <button v-else @click="login">Sign In</button>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { signIn, signOut, getUserProfile } from "../authService";

const isAuthenticated = ref(false);
const user = ref({ name: "", email: "", photo: "" });
const showDropdown = ref(false);

const login = async () => {
  const loginResponse = await signIn();
  if (loginResponse) {
    isAuthenticated.value = true;
    loadUserProfile();
  }
};

const logout = async () => {
  await signOut();
  isAuthenticated.value = false;
  user.value = { name: "", email: "", photo: "" };
  showDropdown.value = false;
};

const loadUserProfile = async () => {
  const profile = await getUserProfile();
  if (profile) {
    user.value.name = profile.displayName;
    user.value.email = profile.mail;
    user.value.photo = profile.photo;
  }
};

const toggleDropdown = (event) => {
  showDropdown.value = !showDropdown.value;
  event.stopPropagation(); 
};

const handleClickOutside = (event) => {
  if (!event.target.closest(".user-actions")) {
    showDropdown.value = false;
  }
};

const goToHome = () => {
  console.log("Navigating to home...");
};

onMounted(async () => {
  document.addEventListener("click", handleClickOutside);
  const profile = await getUserProfile();
  if (profile) {
    isAuthenticated.value = true;
    user.value.name = profile.displayName;
    user.value.email = profile.mail;
    user.value.photo = profile.photo;
  }
});
</script>

<style scoped>

</style>
