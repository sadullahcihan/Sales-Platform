<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'

interface NavLink {
 path: string
 label: string
}

const navLinks: NavLink[] = [
 { path: '/', label: 'Home' },
 { path: '/about', label: 'About' }
]
</script>

<template>
 <div class="min-h-screen bg-[#1a1a1a]">
   <nav class="fixed top-0 inset-x-0 bg-[#2c3e50] h-12 px-4 z-50">
     <div class="container mx-auto h-full flex items-center gap-3">
       <RouterLink to="/" class="flex items-center">
         <div class="text-[#42b883] text-2xl font-bold">V</div>
       </RouterLink>

       <div class="flex gap-1">
         <RouterLink 
           v-for="link in navLinks"
           :key="link.path"
           :to="link.path"
           :class="[
             'px-4 py-1 rounded transition-colors',
             $route.path === link.path ? 'bg-[#3498db]' : 'text-white hover:bg-white/10'
           ]"
         >
           {{ link.label }}
         </RouterLink>
       </div>
     </div>
   </nav>

   <main class="pt-12 flex justify-center">
     <div class="bg-white min-h-[calc(100vh-3rem)] w-[1300px]">
       <div class="p-6">
         <RouterView />
       </div>
     </div>
   </main>
 </div>
</template>

<style>
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';

* {
 margin: 0;
 padding: 0;
 box-sizing: border-box;
}

body {
 font-family: sans-serif;
 -webkit-font-smoothing: antialiased;
 -moz-osx-font-smoothing: grayscale;
 background-color: #1a1a1a;
}
</style>