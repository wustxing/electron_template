import { fileURLToPath, URL } from 'node:url'


import { resolve } from 'node:path'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import useElectron from 'vite-plugin-electron/simple'
import useRenderer from 'vite-plugin-electron-renderer'
import { defineConfig, mergeConfig } from 'vite'
const alias = {
  $: resolve('src'),
  $root: resolve(),
  $docs: resolve('docs'),
  $renderer: resolve('src'),
  $electron: resolve('electron'),
  $control: resolve('control')
}

function mergeCommon(config, { command = '' } = {}) {
  return mergeConfig(
    {
      resolve: {
        alias,
      },
    },
    config,
  )
}
// https://vite.dev/config/
export default function(args){
  return mergeCommon(
    defineConfig({
      build: {
        rollupOptions: {
          input: {
            main: resolve('index.html'),
            // control: resolve('control/index.html'),
          },
        },
      },
      plugins: [
        vue(),
        vueDevTools(),
        useElectron({
          main: {
            entry: 'electron/main.js',
            vite: mergeCommon({}, args),
          },
          preload: {
            input: 'electron/preload.js',
            vite: mergeCommon({}, args),
          },
        }),
        useRenderer(),
      ],
      resolve: {
        alias: {
          '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
      },
    })
  )
}

