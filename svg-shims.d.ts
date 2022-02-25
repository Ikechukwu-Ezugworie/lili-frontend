declare module '*.svg' {
  import { ComponentOptions, FunctionalComponent } from 'vue'
  const ComponentOptions: FunctionalComponent|ComponentOptions
  const VueComponent: ComponentOptions
  export { VueComponent }
}
