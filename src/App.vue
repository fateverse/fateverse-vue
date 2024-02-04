<template>
  <RouterView />
</template>

<script setup>
import {usePermisstionStroe} from '@/stores/permisstion.js'
window.addEventListener('beforeunload', e=>beforeunload(e))
const beforeunload = (()=>{
  const permisstionStore = usePermisstionStroe()
  permisstionStore.setIsLoadRoutes(true)
})
</script>
