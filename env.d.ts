/// <reference types="vite/client" />
declare module '*.js'
declare module '*.ts'
declare module '*.vue' {
  import { DefineComponent } from 'vue'

  const compontent: DefineComponent<{}, {}, any>
  export default compontent
}
