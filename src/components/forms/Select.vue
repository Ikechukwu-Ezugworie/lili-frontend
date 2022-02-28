<template>
  <div class="relative">
    <div class="select w-full max-w-md select-bordered flex items-center" @click="showOpts = !disabled" :disabled="disabled || undefined">
      <div class="w-full text-left" :class="!selected ? 'placeholder' : null">{{ selected || label }}</div>
    </div>
    <template v-if="showOpts">
      <div class="z-0 fixed inset-0" @click="showOpts = false" />
      <div class="absolute z-10 mt-1 w-full rounded bg-white shadow-lg">
        <ul
          ref="optionsEl"
          tabindex="-1"
          role="listbox"
          aria-labelledby="listbox-label"
          aria-activedescendant="listbox-item-3"
          style="max-height: 14rem;"
          class="rounded-md py-1 text-base text-gray-800 leading-6 ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm sm:leading-5"
          @click="showOpts = false"
        >
          <li
            v-for="(opt, i) in opts"
            :key="i"
            role="option"
            class="text-gray-900 cursor-default select-none relative py-2 pl-6 hover:bg-gray-100"
            @click="$emit('update:modelValue', getValue(opt))"
            :data-value="opt"
          >
            <div class="flex items-center space-x-3">
              <span class="font-normal block truncate" :class="{'font-semibold': selected == opt}">{{ opt }}</span>
            </div>
          </li>
        </ul>
      </div>
    </template>
    <div v-if="showErrorMsg" class="text-red-700 text-left font-light text-sm pt-1">{{ error }}</div>
  </div>
</template>

<script lang="ts">
import { ref, watch, computed, defineComponent, toRefs, PropType, onMounted, onUnmounted, nextTick } from 'vue'

type Option = string | number | {
  label: string,
  value: any,
}

export default defineComponent({
  emits: ['update:modelValue'],
  props: {
    label: {
      required: true,
      type: String as PropType<string>,
    },
    options: {
      required: true,
      type: Array as PropType<Option[]>,
    },
    disabled: {
      required: false,
      type: Boolean as PropType<boolean>,
    },
    readonly: {
      required: false,
      type: Boolean as PropType<boolean>,
    },
    defaultOpt: {
      required: false,

      type: String as PropType<string>,
    },
    error: {
      required: false,
      type: [String, Boolean] as PropType<string|boolean>,
    },
    modelValue: [String, Number, Object] as PropType<string|number|Option>,
  },
  setup(props, { emit }) {
    const optionsEl = ref<HTMLUListElement>()
    const showOpts = ref(false)
    const { modelValue, options } = toRefs(props)
    const isPrimitive = (value: any) => typeof value === 'string' || typeof value === 'number'
    const getOptValue = (opt?: Option|string) => isPrimitive(opt) ? opt : opt?.label
    const getValue = (value: any) => props.options.find(opt => {
      if (isPrimitive(opt) && opt === value)
        return true
      return opt.label === value
    })

    const callback = (e: Event|KeyboardEvent) => {
      if (e instanceof KeyboardEvent && e.code === 'Escape') showOpts.value = false
    }

//check if default Option props value exits and use as options else call getOptionValue()
    // const selected = computed(() => props.defaultOpt ? props.defaultOpt : getOptValue(modelValue?.value))
    const selected = computed(() => getOptValue(modelValue?.value))

    const opts = computed(() => options.value.map(opt => {
      return typeof opt === 'object'
        ? opt.label : opt
    }))

    const showErrorMsg = computed(() => typeof props.error === 'string')

    onMounted(() => {
      window.addEventListener('keyup', callback)
    })

    onUnmounted(() => {
      window.removeEventListener('keyup', callback)
    })

    watch(() => props.disabled, val => {
      if (val && showOpts.value) showOpts.value = false
    })

    watch(showOpts, show => {
      nextTick(() => {
        const listEl = optionsEl.value
        const label = selected.value
        if (listEl && show && label) {
          const el = listEl.querySelector(`[data-value='${label}']`) as HTMLElement
          listEl?.scrollTo({
            left: 0,
            top: el.offsetTop - el.offsetHeight * 2,
            behavior: 'smooth'
          })
        }
      })
    })

    return { opts, showOpts, optionsEl, selected, getValue, showErrorMsg }
  }
})
</script>
