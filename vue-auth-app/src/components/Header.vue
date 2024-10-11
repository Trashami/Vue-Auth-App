<template>
    <header class="app-header">
      <div class="container">
        <div class="title">
          <h1>My Vue App</h1>
        </div>
        <div class="user-actions" v-if="isAuthenticated">
            <p class="user-name">{{ user.name }}</p>
            <div v-if="showDropdown" class="dropdown">
              <ul>
                <li @click="loadUserProfile">View Profile</li>
                <li @click="logout">Sign Out</li>
              </ul>
            </div>
          <img
            :src="user.photo"
            alt="Profile"
            class="profile-pic"
            @click="toggleDropdown"
            v-if="user.photo"
          />
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
      user.value.photo = profile.photo;
    }
  };
  
  const toggleDropdown = () => {
    showDropdown.value = !showDropdown.value;
  };
  
  onMounted(async () => {
    const profile = await getUserProfile();
    if (profile) {
      isAuthenticated.value = true;
      user.value.name = profile.displayName;
      user.value.photo = profile.photo;
    }
  });
  </script>
  
  <style scoped>
  .app-header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    background-color: #333;
    color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 1000;
  }
  
  .container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }
  
  .title h1 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: bold;
  }
  
  .user-actions {
    display: flex;
    align-items: center;
    position: relative; 
  }
  
  .user-name {
    margin-left: 1rem;
    padding: 5px;
    font-size: 1rem;
  }
  
  .profile-pic {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    cursor: pointer;
    object-fit: cover;
    padding: 5px;
  }
  
  .dropdown {
    position: absolute;
    top: 50px;
    right: 0;
    background-color: white;
    color: black;
    border-radius: 4px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
    z-index: 2000;
    width: 150px;
  }
  
  .dropdown ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
  }
  
  .dropdown li {
    padding: 0.5rem 1rem;
    cursor: pointer;
  }
  
  .dropdown li:hover {
    background-color: #f0f0f0;
  }
  </style>
  