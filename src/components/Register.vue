<script setup lang="ts">
import { reactive, computed, toRefs, ref } from 'vue'
import { errorMsgs, useForm, ResponseError, Input as TextInput, Select as SelectInput } from './forms/index'
import { activityFlags } from '../hooks/utils'
import { useAuth } from '../hooks/auth'
import { useToast } from "vue-toastification"
import { Login as LoginIcon } from '../assets/icons'
import { useVuelidate } from '@vuelidate/core'
import { helpers } from '@vuelidate/validators'
import {
  alpha,
  email,
  numeric,
  required,
  alphaNum,
  minLength,
  maxLength,
} from '@vuelidate/validators/dist/raw.esm'

const inputs = reactive({
  name: null,
  email: null,
  phone: null,
  password: null,
  confirmPassword: null,
});

const { withMessage } = helpers
const { register, loading } = useAuth()
const errors = ref<Record<string, string[]>>()
const { errorMsg, serverMsg } = useForm(errors)
const toast = useToast();

const rules = computed(() => ({
  name: {
    alpha: withMessage(errorMsgs.alphaNum, alphaNum),
    required: withMessage(errorMsgs.required, required),
    maxLength: withMessage(errorMsgs.maxLength(50), maxLength(50)),
  },
  email: {
    email: withMessage(errorMsgs.email, email),
    required: withMessage(errorMsgs.required, required),
    maxLength: withMessage(errorMsgs.maxLength(100), maxLength(100)),
  },
  phone: {
    numeric: withMessage(errorMsgs.numeric, numeric),
    required: withMessage(errorMsgs.required, required),
    maxLength: withMessage(errorMsgs.maxLength(11), maxLength(11)),
    minLength: withMessage(errorMsgs.minLength(11), minLength(11)),
  },
  password: {
    required: withMessage(errorMsgs.required, required),
    minLength: withMessage(errorMsgs.minLength(6), minLength(6)),
    confirmed: withMessage(
      errorMsgs.confirmed('password'),
      (value?: string) => {
        if (!value) return true
        return value === inputs.confirmPassword
      }
    ),
  },
}))

const $v = useVuelidate(rules, toRefs(inputs))
const toData = () => ({
  name: inputs.name,
  email: inputs.email,
  phone: inputs.phone,
  password: inputs.password,
  password_confirmation: inputs.confirmPassword,
})

const onSubmit = async (e: Event) => {
  errors.value = undefined
  const isValid = await $v.value.$validate()
  if (!isValid) return
  // const resp = await register(toData())
  let resp = null
  loading.value = true
  setTimeout(() => {
    loading.value = false
    toast.success("Singup successfull", {
      toastClassName: "toast-class",
    });
  }, 2500)
  // if (resp.errors) {
  //   errors.value = resp.errors
  // } else {
  //   // router.push('/home')
  // }
}

</script>

<template>
  <div class="space-y-7">
    <text-input
      label="Full Name"
      type="text"
      class="w-full"
      v-model="inputs.name"
      :error="errorMsg($v.name) || serverMsg('fullname')"
    />
    <text-input
      label="Email"
      type="text"
      class="w-full"
      v-model="inputs.email"
      :error="errorMsg($v.email) || serverMsg('email')"
    />
    <text-input
      label="Phone Number"
      type="number"
      class="w-full"
      v-model="inputs.phone"
      :error="errorMsg($v.phone) || serverMsg('phone number')"
    />
    <text-input
      label="Password"
      type="password"
      class="w-full"
      v-model="inputs.password"
      :error="errorMsg($v.password) || serverMsg('password')"
    />
    <text-input
      label="Confirm Password"
      type="password"
      class="w-full"
      v-model="inputs.confirmPassword"
    />
    <div>
      <button
        class="btn w-full gap-2"
        :class="{ loading: loading }"
        @click="onSubmit"
      >
        <login-icon class="rotate-180" v-show="!loading" />Signup
      </button>
      <p class="text-xs mt-1 text-gray-400">
        Have an account?
        <span
          class="btn btn-xs btn-link text-xs text-gray-500"
          @click="$emit('doSignIn', activityFlags.SIGNIN)"
        >
          signin
        </span>
      </p>
    </div>
  </div>
</template>

<style>
.toast-class {
  @apply bg-gray-700 text-gray-100 text-xs border border-gray-100;
}
</style>