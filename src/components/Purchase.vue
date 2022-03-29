<script setup lang="ts">
import { reactive, ref, toRefs, computed } from 'vue'
import { errorMsgs, useForm, ResponseError, Input as TextInput, Select as SelectInput } from './forms/index'
import { activityFlags } from '../hooks/utils'
import VuePaystack from "vue-paystack2"
import { useToast } from "vue-toastification"
import { discos } from '../data/discos'
import { CreditCard as CreditCardIcon } from '../assets/icons/index.js'
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


const emit = defineEmits<{
  (e: 'setActivity', id: number | string): void
}>()
const { withMessage } = helpers
const errors = ref<Record<string, string[]>>()
const { errorMsg, serverMsg } = useForm(errors)
const toast = useToast();
const loading = ref(false);

const inputs = reactive({
  disco: null,
  meterNumber: null,
  phone: null,
  amount: null,
  email: null,
})

const rules = computed(() => ({
  disco: {
    required: withMessage(errorMsgs.required, required),
  },
  meterNumber: {
    numeric: withMessage(errorMsgs.numeric, numeric),
    required: withMessage(errorMsgs.required, required),
    maxLength: withMessage(errorMsgs.maxLength(11), maxLength(11)),
    minLength: withMessage(errorMsgs.minLength(11), minLength(11)),
  },
  phone: {
    numeric: withMessage(errorMsgs.numeric, numeric),
    required: withMessage(errorMsgs.required, required),
    maxLength: withMessage(errorMsgs.maxLength(11), maxLength(11)),
    minLength: withMessage(errorMsgs.minLength(11), minLength(11)),
  },
  amount: {
    numeric: withMessage(errorMsgs.numeric, numeric),
    required: withMessage(errorMsgs.required, required),
    minLength: withMessage(errorMsgs.minLength(1), minLength(1)),
  },
  email: {
    email: withMessage(errorMsgs.email, email),
    maxLength: withMessage(errorMsgs.maxLength(100), maxLength(100)),
    required: withMessage(errorMsgs.required, required),

  },
}))

const $v = useVuelidate(rules, toRefs(inputs))
const toData = () => ({
  disco: inputs.disco,
  meterNumber: inputs.meterNumber,
  phone: inputs.phone,
  amount: inputs.amount * 100,
  email: inputs.email,
})

const verifyMeterNumber = async (meterNumber: string) => {
  const res = await fetch(`/api/v1/meters/${meterNumber}/verify`)
  const data = await res.json()
  if (res.ok) {
    return data
  }
}

const paystack = reactive({
  email: 'i.ezugworie@gmail.com',
  // amount: null,
  firstname: 'Lili',
  // lastname: 'Oluwatobi',
  // phone: '08066261222',
  currency: 'naira',
  reference: '',
  publicKey: 'pk_test_727d12832d1104936ab4fa366e72b06256fe0e92',
  privateKey: 'sk_test_da2bb19ad0c9b8ab8510c1e51e6488520714b952',
  onSuccess: (response) => {
    activityFlags.IS_PAYING = false;
    // toast.success("Transaction successfull", {
    //     toastClassName: "toast-class",
    // });
    console.log(response.reference);
    loading.value = false;
  },
  onClose: () => {
    activityFlags.IS_PAYING = false;
    toast.info("Transaction closed", {
      toastClassName: "toast-class",
    });
    loading.value = false;
  },
});

const buyUnit = () => {
  activityFlags.IS_PAYING = true;
  emit('setActivity', activityFlags.PURCHASE);
}

const onSubmit = async (e: Event) => {
  errors.value = undefined
  const isValid = await $v.value.$validate()
  if (!isValid) return
  // const resp = await register(toData())
  let resp = null
  loading.value = true
  buyUnit()
}

</script>

<template>
  <div class="space-y-7">
    <select-input
      label="DISCOS"
      :options="discos"
      v-model="inputs.disco"
      :defaultOpt="discos[0].label"
      :error="errorMsg($v.disco) || serverMsg('discos')"
    />
    <text-input
      label="Meter Number"
      type="number"
      min="0"
      maxlength="11"
      class="w-full"
      v-model="inputs.meterNumber"
      :error="errorMsg($v.meterNumber) || serverMsg('meterNumber')"
    />
    <text-input
      label="Phone Number"
      type="number"
      min="0"
      class="w-full"
      v-model="inputs.phone"
      :error="errorMsg($v.phone) || serverMsg('phone')"
    />
    <text-input
      label="Amount"
      type="number"
      min="0"
      v-model="inputs.amount"
      class="w-full"
      :error="errorMsg($v.amount) || serverMsg('amount')"
    />
    <text-input
      label="Email (**)"
      type="text"
      v-model="inputs.email"
      class="w-full"
      :error="errorMsg($v.email) || serverMsg('email')"
    />
    <div class="w-auto">
      <button class="btn w-full gap-2 modal-button" for="my-modal-3" @click="onSubmit">
        <credit-card-icon />Buy Now
      </button>
      <p class="text-xs mt-2 text-gray-400">
        Siginin to keep records of your purchase
        <!-- No account yet? -->
        <span
          class="btn btn-xs btn-link text-xs text-gray-500"
          @click="$emit('doSignIn', activityFlags.SIGNIN)"
        >signin</span>
      </p>

      <div class="w-full">
        <VuePaystack
          v-if="activityFlags.IS_PAYING"
          :paystack-key="paystack.publicKey"
          :firstname="paystack.firstname"
          :email="inputs.email || paystack.email"
          :amount="inputs.amount * 100"
          :reference="paystack.reference"
          :callback="paystack.onSuccess"
          :close="paystack.onClose"
        >Paystack</VuePaystack>
      </div>
    </div>
  </div>
</template>

<style>
.toast-class {
  @apply bg-gray-700 text-gray-100 text-xs border border-gray-100;
}
</style>