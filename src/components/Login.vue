<script setup lang="ts">
import { reactive, computed, toRefs, ref } from 'vue'
import { errorMsgs, useForm, ResponseError, Input as TextInput, Select as SelectInput } from './forms/index'
import { activityFlags } from '../hooks/utils'
import { Login as LoginIcon } from '../assets/icons'
import { useAuth } from '../hooks/auth'
import { useToast } from "vue-toastification"
import { useVuelidate } from '@vuelidate/core'
import { helpers } from '@vuelidate/validators'
import {
  email,
  required,
  minLength,
  maxLength,
} from '@vuelidate/validators/dist/raw.esm'

const inputs = reactive({
  email: null,
  password: null,
});

const { withMessage } = helpers
const { register, loading } = useAuth()
const errors = ref<Record<string, string[]>>()
const { errorMsg, serverMsg } = useForm(errors)
const toast = useToast()

const rules = computed(() => ({
  email: {
    email: withMessage(errorMsgs.email, email),
    required: withMessage(errorMsgs.required, required),
    maxLength: withMessage(errorMsgs.maxLength(50), maxLength(50)),
  },

  password: {
    required: withMessage(errorMsgs.required, required),
    minLength: withMessage(errorMsgs.minLength(6), minLength(6))
  },
}))

const $v = useVuelidate(rules, toRefs(inputs))
const toData = () => ({
  email: inputs.email,
  password: inputs.password,
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
    toast.success(" successfull", {
      toastClassName: "toast-class",
    });
  }, 2500)
}
</script>

<template>
  <div class="space-y-7">
    <text-input
      label="Email"
      type="email"
      class="w-full"
      v-model="inputs.email"
      :error="errorMsg($v.email) || serverMsg('email')"
    />
    <text-input
      label="Password"
      type="password"
      v-model="inputs.password"
      :error="errorMsg($v.password) || serverMsg('password')"
    />
    <div>
      <button
        class="btn w-full gap-2"
        :class="{ loading: loading }"
        @click="onSubmit"
      >
        <login-icon class="rotate-180" v-show="!loading" />Signin
      </button>
      <p class="text-xs mt-1 text-gray-400">
        No account yet?
        <span
          class="btn btn-xs btn-link text-xs text-gray-500"
          @click="$emit('doSignUp', activityFlags.SIGNUP)"
        >
          create one
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