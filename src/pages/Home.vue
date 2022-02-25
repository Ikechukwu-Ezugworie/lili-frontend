<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import { CircuitBoard } from '../assets/index'
import AppNavbar from '../components/navs/AppNavbar.vue'
</script>

<template>
  <div class="flex flex-row justify h-screen">
    <div class="w-1/2 justify-center flex items-center">
      <p class="text-gray-700 font-black text-9xl text-center">LILI</p>
    </div>

    <div class="w-1/2 bg-gray-100">
      <div class="opacity-25 h-full bg-[url('/img/circuit-board.svg')]">
        hi
      </div>
    </div>

    
  </div>
</template>

<style>

/* .pattern {
  background-image:linear-gradient(#87509ce6, #87509ce6),
} */
</style>
