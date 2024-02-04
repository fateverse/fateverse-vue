import {defineStore} from "pinia";
import {ref} from "vue";
import {getCacheOpt, getCacheType} from "../api/cache";

export const useCacheStore = defineStore('cache',()=>{
  const cacheKeyOpt = ref(new Map())
  const cacheKeyType = ref(new Map())

  const setCacheKey = async (key) => {
    try {
      const { code, data } = await getCacheType(key)
      if(code === 1000) {
        cacheKeyType.value.set(key, data[key])
      }
    } catch(err) {
      new Error(err)
    }
  }

  const getDict = (key) => {
    let dict
    if (!cacheKeyType.value.has(key)) {
      setCacheKey(key)
    } else {
      dict = cacheKeyType.value.get(key)
    }
    return dict
  }


  const checkKey = (keys) => {
    let result = []
    for (let key of keys) {
      if (!cacheKeyType.value.has(key) ) {
        result.push(key)
      }
    }
    return result;
  }

  return {
    cacheKeyOpt,
    cacheKeyType,
    setCacheKey,
    getDict,
  }
})
