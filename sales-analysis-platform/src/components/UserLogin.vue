<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { salesService } from "@/services/sales.service";
import { useSalesStore } from "@/stores/sales";
import type { LoginCredentials } from "@/types/auth.types";

// Store & Router setup
const router = useRouter()
const authStore = useAuthStore()
const salesStore = useSalesStore()

// Form state
const email = ref('homework@eva.guru')
const password = ref('Homeworkeva1**')
const isLoading = ref(false)
const error = ref('')

// Constants
const LOGIN_CREDENTIALS: Omit<LoginCredentials, 'Email' | 'Password'> = {
 GrantType: 'password',
 Scope: 'amazon_data',
 ClientId: 'C0001',
 ClientSecret: 'SECRET0001',
 RedirectUri: 'https://api.eva.guru'
}

// Methods
const handleLogin = async () => {
 try {
   isLoading.value = true
   error.value = ''

   await authStore.login({
     ...LOGIN_CREDENTIALS,
     Email: email.value,
     Password: password.value
   })

   await authStore.getUserInfo()

   const { sellerId, marketplace } = authStore
   if (!sellerId || !marketplace) {
     throw new Error('Store information not available')
   }

   const salesData = await salesService.getDailySalesOverview({
     marketplace,
     sellerId,
     requestStatus: 0,
     day: 60,
     excludeYoYData: true
   })

   if (salesData) {
     router.push('/dashboard')
   }
 } catch {
   error.value = 'Login failed. Please check your credentials.'
 } finally {
   isLoading.value = false
 }
}
</script>

<template>
 <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
   <div class="max-w-md w-full space-y-8">
     <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
       Sales Analysis Platform
     </h2>

     <form @submit.prevent="handleLogin" class="mt-8 space-y-6">
       <div class="rounded-md shadow-sm -space-y-px">
         <div>
           <label for="email" class="sr-only">Email address</label>
           <input
             id="email"
             v-model="email"
             type="email"
             required
             class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
             placeholder="Email address"
           >
         </div>
         <div>
           <label for="password" class="sr-only">Password</label>
           <input
             id="password"
             v-model="password"
             type="password"
             required
             class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
             placeholder="Password"
           >
         </div>
       </div>

       <button
         type="submit"
         :disabled="isLoading"
         class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
       >
         <span class="absolute left-0 inset-y-0 flex items-center pl-3">
           <svg
             v-if="!isLoading"
             class="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
             xmlns="http://www.w3.org/2000/svg"
             viewBox="0 0 20 20"
             fill="currentColor"
             aria-hidden="true"
           >
             <path
               fill-rule="evenodd"
               d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
               clip-rule="evenodd"
             />
           </svg>
           <svg
             v-else
             class="animate-spin h-5 w-5 text-indigo-500"
             xmlns="http://www.w3.org/2000/svg"
             fill="none"
             viewBox="0 0 24 24"
           >
             <circle
               class="opacity-25"
               cx="12"
               cy="12"
               r="10"
               stroke="currentColor"
               stroke-width="4"
             />
             <path
               class="opacity-75"
               fill="currentColor"
               d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
             />
           </svg>
         </span>
         {{ isLoading ? 'Signing in...' : 'Sign in' }}
       </button>

       <p v-if="error" class="text-red-600 text-center text-sm">
         {{ error }}
       </p>
     </form>
   </div>
 </div>
</template>