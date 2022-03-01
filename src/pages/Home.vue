<script setup lang="ts">
import { defineComponent, PropType, computed, onMounted, onUnmounted, ref, reactive } from 'vue'
import AppNavbar from '../components/navs/AppNavbar.vue'
import { errorMsgs, useForm, ResponseError, Input as TextInput, Select as SelectInput } from '../components/forms/index'
import { useVuelidate } from '@vuelidate/core'
import { helpers } from '@vuelidate/validators'
import { Login as LoginIcon, Cash as CashIcon } from '../assets/icons/index.js'
import { useToast } from "vue-toastification"
import { Login, Register, Purchase } from '../components'
import { activityFlags } from '../hooks/utils'
import { discos } from '../data/discos'

const currentActivity = ref(activityFlags.PURCHASE);
const setActivity = (flag: number) => {
  currentActivity.value = flag;
}

const user = reactive({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
  phone: '',
  address: '',
})



// const { errorMsg, serverMsg } = useForm(errors)


</script>

<template>
  <div class="md:flex md:flex-row justify min-h-screen bg-[url('/img/circuit-board.svg')] md:bg-none">
    <div class="hidden sm:w-1/2 justify-center md:flex flex-col items-center">
      <p class="text-gray-700 font-black text-9xl text-center">LILI</p>
      <p class="text-gray-700 text-base text-center">
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
            h-1/4
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

    <div class="md:w-1/2 bg-gray-100">
      <div
        class="
          flex flex-col
          justify-between
          items-center
          relative
          h-full
          bg-opacity-100 bg-[url('/img/circuit-board.svg')]
          after:opacity-50
        "
      >
        <div class="block md:hidden p-2">
          <p class="text-gray-700 font-black text-7xl text-center mt-2">LILI</p>
          <p class="text-gray-700 text-sm text-center">
            Purchase prepaid meter units with ease <br />
            from all discos in Nigeria.
          </p>
        </div>
        <div class="flex flex-row space-x-2 w-full justify-end p-4">
          <button
            class="btn btn-sm gap-2 text-xs"
            v-if="currentActivity === activityFlags.PURCHASE"
            @click="setActivity(activityFlags.SIGNIN)"
          >
            <login-icon class="rotate-180"/>Signin
          </button>
          <button
            class="btn btn-sm gap-2 text-xs"
            v-else
            @click="setActivity(activityFlags.PURCHASE)"
          >
            <cash-icon />Purchase
          </button>
        </div>

        <div
          class="
            flex flex-col
            bg-opacity-80
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
</style>
