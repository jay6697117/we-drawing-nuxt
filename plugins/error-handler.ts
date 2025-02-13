export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.config.errorHandler = (error, instance, info) => {
    console.error('Vue Error:', error)
    console.error('Component:', instance)
    console.error('Error Info:', info)
  }

  nuxtApp.hook('vue:error', (error) => {
    console.error('Nuxt Error:', error)
  })
})
