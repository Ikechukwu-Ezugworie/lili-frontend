import { format, parseISO } from 'date-fns'
import { reactive } from 'vue'


export function noop(...args) { }

export const formatMoney = (value: string | number) => `₦${chunkReverse(String(value), 3, ',')}`
export const formatUnit = (value: string | number) => `${chunkReverse(String(value), 3, ',')}`

export const chunkReverse = (str: string, size = 4, separator = '-') => {
  let start = str.length % size
  const parts = [str.substring(0, start)]

  while (start < str.length) {
    const part = str.substring(start, start + size)
    parts.push(part)
    start += size
  }

  return parts.filter(val => !!val).join(separator)
}

export const chunk = (str: string, size = 4, separator = '-') => {
  let index = 0
  const parts: string[] = []

  while (index < str.length) {
    const part = str.substring(index, index + size)
    parts.push(part)
    index += size
  }

  return parts.join(separator)
}

export const debounce = function (fn: VoidFunction, wait: number = 250, immediate: boolean = false) {
  let timeout

  function debounced(/* ...args */) {
    const args = arguments

    const later = () => {
      timeout = void 0
      if (immediate !== true) {
        fn.apply<any, any, any>(this, args)
      }
    }

    clearTimeout(timeout)
    if (immediate === true && timeout === void 0) {
      fn.apply<any, any, any>(this, args)
    }
    timeout = setTimeout(later, wait)
  }

  debounced.cancel = () => {
    clearTimeout(timeout)
  }

  return debounced
}

type Response = {
  status: string,
  message?: string,
  response_hash?: string,
}

export const getResponseStatus = (response: Response) => {
  const isOk = (res: Response) => {
    return res.status === '00' ||
      res.message?.toLowerCase() === 'successful' ||
      res.message?.toLowerCase() === 'successfull'
  }
  let text
  const hasHash = (v: Response) => !!v.response_hash

  if (response && hasHash(response) && !isOk(response)) {
    text = 'pending'
  } else if (response && isOk(response)) {
    text = 'successful'
  } else if (response && !isOk(response)) {
    text = 'error'
  }

  return text
}

export const formatDate = (val: string) => {
  const ex = parseISO(val)
  return format(ex, 'MMM dd, yyyy')
}

export const formatTime = (val: string) => {
  const ex = parseISO(val)
  return format(ex, 'hh:mm a')
}

export const activityFlags = reactive({
  PURCHASE: 1,
  SIGNIN: 2,
  SIGNUP: 3,
  IS_PAYING: false,
  loading: false,
}); 
