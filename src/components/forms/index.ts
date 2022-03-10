import { nextTick, reactive, ref, Ref, unref, watch } from 'vue'
// import rdiff from 'recursive-diff'
import { Validation } from '@vuelidate/core'
import { helpers } from '@vuelidate/validators'
import Input from './Input.vue';
import Select from './Select.vue';

export { Input, Select };


export type ResponseError = Record<string, string|string[]>

export const errorMsgs = {
  required: 'This field is required',
  numeric: 'This field must be a number',
  email: 'This field must be a valid email',
  alpha: 'The field may only contain letters',
  alphaNum: 'The field can only contain letters and numbers',
  address: 'This field must be a valid address',
  alphaSpace: 'The field may contain only alphanum and space characters',
  confirmed: (field: string) => `The ${field} confirmation does not match`,
  length: (size: number) => `This field must be exactly ${size} characters`,
  max: (size: number) => `This field must not be greater than ${size}`,
  min: (size: number) => `This field must not be less than ${size}`,
  maxLength: (size: number) => `This field must not be greater than ${size} characters`,
  minLength: (size: number) => `This field must not be less than ${size} characters`,
}

const errorMsg = (input: Validation, all: boolean = false) => {
  return input?.$error
    ? all ? input.$errors : input.$errors[0].$message
    : null
}

const serverMsg = (errors?: Ref<ResponseError|undefined>|ResponseError) =>
  (field: string, all: boolean = false) => {
    if (!errors) return null
    const ob = unref(errors)

    return ob && Array.isArray(ob[field])
      ? all ? ob[field] : ob[field][0]
      : null
  }

export const useForm = (serverErrors?: Ref<ResponseError|undefined>) => {
  return { errorMsg, serverMsg: serverMsg(serverErrors) }
}

// export const useTrackInputs = <T extends object>(inputs: T, watchProps: boolean = true) => {
//   let last: any = {...inputs}
//   const changed = ref(false)
//   const inputsRef = reactive<T>(inputs)
//   const clean = (newValue: T = {} as any) => nextTick(() => {
//     last = {...newValue}
//     changed.value = false
//   })

//   // watch(inputsRef, inputs => {
//   //   const ob = {...inputs}

//   //   if (watchProps) {
//   //     const changes = rdiff.getDiff({...last}, ob)
//   //     changed.value = !!changes.length
//   //   } else {
//   //     changed.value = true
//   //   }
//   // })

//   return { changed, clean, inputs: inputsRef, }
// }

const { regex } = helpers

export const address = regex(/^[a-zA-Z0-9\s,'-.]*$/)
export const alphaSpace = regex(/^[a-z\d\-_\s]+$/i)
