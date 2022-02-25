<style scoped>

.nav--btn {
  @apply relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm cursor-pointer;
  @apply leading-5 font-medium rounded-md text-gray-700 bg-white transition ease-in-out duration-150;

  &:active {
    @apply bg-gray-100 text-gray-700;
  }
  &:hover, &.disabled {
    @apply text-gray-500;
  }

  &.disabled {
    @apply cursor-not-allowed pointer-events-none;
  }
}

.nav--btn-extra {
  @apply relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm leading-5 font-medium text-gray-500 transition ease-in-out duration-150;

  &:hover {
    @apply text-gray-400;
  }
  &:focus {
    @apply z-10 outline-none border-purple-300;
  }
  &:active {
    @apply bg-gray-100 text-gray-500;
  }
  &.disabled {
    @apply text-gray-400 cursor-not-allowed pointer-events-none;
  }
}

.page--btn {
  @apply -ml-px relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm leading-5 font-medium text-gray-700 transition ease-in-out duration-150;
  &:hover {
    @apply text-gray-500;
  }
  &:focus {
    @apply z-10 outline-none border-purple-300;
  }
  &:active {
    @apply bg-gray-100 text-gray-700;
  }
}
</style>

<template>
  <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
    <div class="flex-1 flex justify-between sm:hidden">
      <span class="nav--btn" :class="{disabled: !canGoBackward}" @click="onPrevious">Previous</span>
      <span class="ml-3 nav--btn" :class="{disabled: !canGoForward}" @click="onNext">Next</span>
    </div>
    <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
      <div>
        <p class="text-sm leading-5 text-gray-700">
          Showing
          <span class="font-medium">{{ total > 0 ? pagination.startIndex + 1 : 0 }}</span>
          to
          <span class="font-medium">{{ pagination.endIndex + 1 }}</span>
          of
          <span class="font-medium">{{ total }}</span>
          results
        </p>
      </div>
      <div>
        <nav class="relative z-0 inline-flex shadow-sm">
          <a
            href="#"
            class="nav--btn-extra rounded-l-md"
            :class="!canGoBackward ? 'disabled' : null"
            aria-label="Previous"
            @click.prevent="onPrevious"
          >
            <!-- Heroicon name: chevron-left -->
            <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
          </a>
          <a
            v-for="page in pagination.pages"
            :key="page"
            href="#"
            @click.prevent="updatePage(page)"
            class="page--btn"
          >{{ page }}</a>
          <a
            href="#"
            class="-ml-px nav--btn-extra rounded-r-md"
            :class="!canGoForward ? 'disabled' : null"
            aria-label="Next"
            @click.prevent="onNext"
          >
            <!-- Heroicon name: chevron-right -->
            <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
            </svg>
          </a>
        </nav>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { watch, computed, defineComponent } from 'vue'

export default defineComponent({
  emits: ['update:modelValue'],
  props: {
    modelValue: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    perPage: {
      type: [Number, String],
      default: 15,
    },
    maxPages: {
      type: [Number, String],
      default: 5,
    },
  },
  setup(props, { emit }) {
    const totalPages = computed(() => Math.ceil(props.total / props.perPage))
    const canGoForward = computed(() => props.modelValue < totalPages.value)
    const canGoBackward = computed(() => props.modelValue > 1)

    const pagination = computed(() => {
      let startPage: number, endPage: number
      const maxPages = props.maxPages
      const pageSize = +props.perPage
      const currentPage = props.modelValue
      if (totalPages.value <= maxPages) {
        // total pages less than max so show all pages
        startPage = 1
        endPage = totalPages.value
      } else {
        // total pages more than max so calculate start and end pages
        const maxPagesBeforeCurrentPage = Math.floor(maxPages / 2)
        const maxPagesAfterCurrentPage = Math.ceil(maxPages / 2) - 1
        if (currentPage <= maxPagesBeforeCurrentPage) {
          // current page near the start
          startPage = 1
          endPage = maxPages
        } else if (currentPage + maxPagesAfterCurrentPage >= totalPages.value) {
          // current page near the end
          startPage = totalPages.value - maxPages + 1
          endPage = totalPages.value
        } else {
          // current page somewhere in the middle
          startPage = currentPage - maxPagesBeforeCurrentPage
          endPage = currentPage + maxPagesAfterCurrentPage
        }
      }
      const startIndex = (currentPage - 1) * pageSize
      const endIndex = Math.min(startIndex + pageSize - 1, props.total - 1)

      const pages = Array.from(Array((endPage + 1) - startPage)).map((_, i) => startPage + i)

      return { pages, endIndex, startIndex, }
    })

    const updatePage = (value: number) => {
      if (value > 0 && value <= totalPages.value) {
        emit('update:modelValue', value)
      }
    }

    const onNext = () => updatePage(props.modelValue + 1)
    const onPrevious = () => updatePage(props.modelValue - 1)

    watch(() => props.modelValue, num => {
      if (num < 1) updatePage(1)
      if (num > totalPages.value) updatePage(totalPages.value)
    })

    return {
      onNext,
      onPrevious,
      pagination,
      totalPages,
      updatePage,
      canGoForward,
      canGoBackward,
    }
  }
})
</script>
