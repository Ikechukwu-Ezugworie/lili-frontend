<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import { defineComponent, PropType, computed, onMounted, onUnmounted, ref, reactive } from 'vue'
import AppNavbar from '../components/navs/AppNavbar.vue'
import { errorMsgs, useForm, ResponseError, Input as TextInput } from '../components/forms/index'
import { useVuelidate } from '@vuelidate/core'
import { helpers } from '@vuelidate/validators'
import {Enter as EnterIcon, Cash as CashIcon} from '../assets/icons/index.js'

const activityFlags = reactive({
  PURCHASE: 1,
  SIGNIN: 2,
  SIGNUP: 3,
  loading: false,
});

const currentActivity = ref(activityFlags.PURCHASE);
const setActivity = (flag: number) => {
  currentActivity.value = flag;
}

// const { errorMsg, serverMsg } = useForm(errors)


</script>

<template>
  <div class="flex flex-row justify h-screen">
    <div class="w-1/2 justify-center flex items-center">
      <p class="text-gray-700 font-black text-9xl text-center">LILI</p>
    </div>

    <div class="w-1/2 bg-gray-100">
      <div
        class="
          flex flex-col
          justify-between
          items-center
          relative
          h-full
          bg-opacity-100 bg-[url('/img/circuit-board.svg')]
          after:opacity-50
          pattern
        "
      >
        <div class="flex flex-row space-x-2 w-full justify-end p-4">
          <button
            class="btn btn-sm gap-2 text-xs"
            v-if="currentActivity === activityFlags.PURCHASE"
            @click="setActivity(activityFlags.SIGNIN)"
          >
            <enter-icon />Signin
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
          v-if="currentActivity === activityFlags.PURCHASE"
          class="
            flex flex-col
            opacity-100
            relative
            bg-opacity-90
            space-y-7
            w-3/5
            bg-white
            p-8
            rounded-xl
            shadow-xl
          "
        >
          <text-input label="Meter Number" type="number" />
          <text-input label="Phone Number" type="text" />
          <text-input label="Unit Amount" type="text" />
          <text-input label="Email (Optional)" type="text" />
          <div>
            <button class="btn w-full">Buy Now</button>
            <p class="text-sm mt-2 text-gray-400">
              No account yet?
              <span
                class="btn btn-xs btn-link text-xs text-gray-500"
                @click="setActivity(activityFlags.SIGNUP)"
              >
                create one
              </span>
            </p>
          </div>
        </div>

        <div
          v-else-if="currentActivity === activityFlags.SIGNIN"
          class="
            flex flex-col
            bg-opacity-90
            space-y-7
            w-3/5
            bg-white
            p-10
            rounded-xl
            shadow-xl
          "
        >
          <text-input label="Usermane or Email" type="text" class="w-full" />
          <text-input label="Password" type="password" />
          <div>
            <button class="btn w-full">Signin</button>
            <p class="text-sm mt-2 text-gray-400">
              No account yet?
              <span
                class="btn btn-xs btn-link text-xs text-gray-500"
                @click="setActivity(activityFlags.SIGNUP)"
              >
                create one
              </span>
            </p>
          </div>
        </div>

        <div
          v-else-if="currentActivity === activityFlags.SIGNUP"
          class="
            flex flex-col
            bg-opacity-90
            space-y-7
            w-3/5
            bg-white
            p-10
            rounded-xl
            shadow-xl
          "
        >
          <text-input label="Full Name" type="text" class="w-full" />
          <text-input label="Email" type="text" class="w-full" />
          <text-input label="Phone Number" type="number" class="w-full" />
          <text-input label="Password" type="password" />
          <text-input label="Confirm Password" type="password" />
          <div>
            <button class="btn w-full">Signup</button>
            <p class="text-sm mt-2 text-gray-400">
              Have an account?
              <span
                class="btn btn-xs btn-link text-xs text-gray-500"
                @click="setActivity(activityFlags.SIGNIN)"
              >
                signin
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.pattern {
  /* background: rgba(76, 175, 80, 0.3); */
}
</style>
