<script setup lang="ts">
import { defineComponent, PropType, computed, onMounted, onUnmounted, ref, reactive } from 'vue'
import AppNavbar from '../components/navs/AppNavbar.vue'
import { errorMsgs, useForm, ResponseError, Input as TextInput, Select as SelectInput } from '../components/forms/index'
import { useVuelidate } from '@vuelidate/core'
import { helpers } from '@vuelidate/validators'
import { Login as LoginIcon, Cash as CashIcon } from '../assets/icons/index.js'
import { useToast } from "vue-toastification"
import { Login, Register, Purchase, Swap } from '../components'
import { activityFlags } from '../hooks/utils'
import { useLocalStorage } from '../hooks/localStorageControl'
import { discos } from '../data/discos'


const currentActivity = ref(activityFlags.PURCHASE);
const setActivity = (flag: number) => {
  currentActivity.value = flag;
}
const { getItem, setItem, removeItem } = useLocalStorage();
let theme = getItem('theme')

const user = reactive({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
  phone: '',
  address: '',
})

const setTheme = (theme: string) => {
  // setItem('theme', theme)
  // console.log(theme, "Setting thisssss")
    setItem('theme', theme)
  if (theme === 'dark' || (!(theme) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.remove('light')
    document.documentElement.classList.add('dark')
    // theme = 'dark'
    // setTheme(theme)
  } else {
    document.documentElement.classList.remove('dark')
    document.documentElement.classList.add('light')
    // theme = 'light'
    // setTheme(theme)
  }
}


const toggleDarkScreen = () => {
  console.log('toogling screen color from', theme, 'to', theme === 'dark' ? 'light' : 'dark')
  // theme = flag ? 'dark' : 'light'
  theme = theme === 'dark' ? 'light' : 'dark'
  setTheme(theme)
    console.log(theme, "Setting thisssss")

}


// const { errorMsg, serverMsg } = useForm(errors)


onMounted(() => {
  theme = 'dark'
  setTheme(theme)
  console.log('mounted', theme)

})
</script>

<template>
  <div
    class="
      md:flex md:flex-row
      justify
      min-h-screen
      bg-[url('/img/circuit-board.svg')]
      dark:bg-gray-700
      md:bg-none
    "
  >
    <div class="hidden sm:w-1/2 justify-center md:flex flex-col items-center">
      <p class="hero--text font-black text-9xl">LILI</p>
      <p class="hero--text text-center text-base">
        Purchase prepaid meter units with ease <br />
        from all discos in Nigeria.
      </p>

      <div class="hidden md:flex md:flex-wrap justify-center space-x-2 p-4">
        <img
          v-for="(disco, i) in discos"
          :key="i"
          :src="disco.logo"
          alt="disco.label"
          class="
            w-1/6
            h-7/12
            mb-2
            border
            shadow
            rounded-tr-xl rounded-bl-xl
            hover:opacity-100 hover:grayscale-0
            opacity-20
            grayscale
            p-0.5
            ease-in-out
            duration-500
            ring-1 ring-gray-200
          "
        />
      </div>
    </div>

    <div class="md:w-1/2 bg-gray-100 dark:bg-gray-700">
      <div
        class="
          flex flex-col
          justify-between
          items-center
          relative
          h-full
          bg-opacity-100 bg-[url('/img/circuit-board.svg')]
          dark:bg-gray-700
          after:opacity-50
        "
      >
        <div class="block md:hidden m-2 p-2">
          <p class="hero--text font-black text-7xl mt-2">LILI</p>
          <p class="hero--text text-sm font-semibold">
            Purchase prepaid meter units with ease <br />
            from all discos in Nigeria.
          </p>
        </div>
        <div class="flex flex-row space-x-2 w-full justify-end p-4">
          <button
            class="btn btn-sm gap-2 text-xs dark:bg-gray-100 dark:text-gray-900 dark:border-gray-100"
            v-if="currentActivity === activityFlags.PURCHASE"
            @click="setActivity(activityFlags.SIGNIN)"
          >
            <login-icon class="rotate-180" />Signin
          </button>
          <button
            class="btn btn-sm gap-2 text-xs dark:bg-gray-100 dark:text-gray-900 dark:border-gray-100"
            v-else
            @click="setActivity(activityFlags.PURCHASE)"
          >
            <cash-icon />Purchase
          </button>
          <swap class="w-1/12 dark:text-gray-50 " @change="toggleDarkScreen" />
        </div>

        <div
          class="
            flex flex-col
            bg-opacity-80
            dark:bg-opacity-95
            w-full
            md:w-4/5
            lg:w-3/5
            2xl:w-1/2
            bg-white
            p-8
            md:rounded-xl
            shadow-xl
          "
        >
          <Purchase
            v-if="currentActivity === activityFlags.PURCHASE"
            @do-sign-in="setActivity"
          />
          <Login
            v-else-if="currentActivity === activityFlags.SIGNIN"
            @do-sign-up="setActivity"
          />
          <Register
            v-else-if="currentActivity === activityFlags.SIGNUP"
            @do-sign-in="setActivity"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.toast-class {
  @apply bg-gray-700 text-gray-100 text-xs;
}

.hero--text {
  @apply text-gray-700 dark:text-gray-100 text-center;
}
</style>
