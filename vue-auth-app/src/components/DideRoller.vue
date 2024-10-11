<template>
    <div class="app-body">
      <div class="dice-roller">
        <h2>Roll the Dice!</h2>
        <div class="dice-options">
          <button v-for="dice in diceTypes" :key="dice" @click="rollDice(dice)">
            Roll D{{ dice }}
          </button>
        </div>
        <p v-if="result !== null" class="dice-result">
          You rolled a: {{ result }}
        </p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const diceTypes = [4, 6, 8, 10, 12, 20];
  const result = ref(null);
  
  const rollDice = (sides) => {
    result.value = Math.floor(Math.random() * sides) + 1;
  };
  </script>
  
  <style scoped>
  .dice-roller {
    margin-top: 2rem;
    text-align: center;
  }
  
  .dice-options button {
    margin: 0.5rem;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    background-color: #333;
    color: white;
    border: none;
  }
  
  .dice-options button:hover {
    background-color: #555;
  }
  
  .dice-result {
    font-size: 1.5rem;
    margin-top: 1rem;
  }
  </style>
  