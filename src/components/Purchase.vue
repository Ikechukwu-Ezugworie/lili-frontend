<script setup lang="ts">
import { reactive, ref } from 'vue'
import { errorMsgs, useForm, ResponseError, Input as TextInput, Select as SelectInput } from './forms/index'
import { activityFlags } from '../hooks/utils'
import VuePaystack from "vue-paystack2"
import { useToast } from "vue-toastification"
import { discos } from '../data/discos'
import { CreditCard as CreditCardIcon } from '../assets/icons/index.js'


const emit = defineEmits<{
  (e: 'setActivity', id: number | string): void
}>()

const toast = useToast();

const unitInfo = reactive({
  disco: '',
  amount: ''
})





const paystack = reactive({
  email: '',
  amount: null,
  firstname: 'Ibrahim',
  lastname: 'Oluwatobi',
  phone: '08066261222',
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
  },
  onClose: () => {
    activityFlags.IS_PAYING = false;
    toast.info("Transaction closed", {
      toastClassName: "toast-class",
    });
  },
});

const buyUnit = () => {
  activityFlags.IS_PAYING = true;
  emit('setActivity', activityFlags.PURCHASE);
}


</script>

<template>
  <div class="space-y-7">
    <select-input
      label="DISCOS"
      :options="discos"
      v-model="unitInfo.disco"
      :defaultOpt="discos[0].label"
    />
    <text-input label="Meter Number" type="number" min="0" class="w-full" />
    <text-input label="Phone Number" type="number" min="0" class="w-full" />
    <text-input
      label="Amount"
      type="number"
      min="0"
      v-model="paystack.amount"
      class="w-full"
    />
    <text-input
      label="Email (Optional)"
      type="text"
      v-model="paystack.email"
      class="w-full"
    />
    <div class="w-auto">
      <button class="btn w-full gap-2" @click="buyUnit()">
        <credit-card-icon />Buy Now
      </button>
      <p class="text-xs mt-2 text-gray-400">
        Siginin to keep records of your purchase
        <!-- No account yet? -->
        <span
          class="btn btn-xs btn-link text-xs text-gray-500"
          @click="$emit('doSignIn', activityFlags.SIGNIN)"
        >
          signin
        </span>
      </p>

      <div class="w-full">
        <VuePaystack
          v-if="activityFlags.IS_PAYING"
          :paystack-key="paystack.publicKey"
          :firstname="paystack.firstname"
          :email="paystack.email"
          :amount="paystack.amount"
          :reference="paystack.reference"
          :callback="paystack.onSuccess"
          :close="paystack.onClose"
        >
          Paystack
        </VuePaystack>
      </div>
    </div>
  </div>
</template>

<style>
.toast-class {
  @apply bg-gray-700 text-gray-100 text-xs;
}
</style>