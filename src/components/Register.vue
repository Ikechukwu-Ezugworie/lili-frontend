<script setup lang="ts">
import { errorMsgs, useForm, ResponseError, Input as TextInput, Select as SelectInput } from './forms/index'
import { activityFlags } from '../hooks/utils'
import { Login as LoginIcon } from '../assets/icons'

</script>

<template>
  <div class="space-y-7">
    <text-input label="Full Name" type="text" class="w-full" />
    <text-input label="Email" type="text" class="w-full" />
    <text-input label="Phone Number" type="number" class="w-full" />
    <text-input label="Password" type="password" class="w-full" />
    <text-input label="Confirm Password" type="password" class="w-full" />
    <div>
      <button class="btn w-full gap-2"> <login-icon class="rotate-180"/>Signup</button>
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
</style>