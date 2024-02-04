<template>
  <template v-if="elementIcon">
    <template v-if="title === ''">
      <el-icon @click="handle">
        <component :is="name"/>
      </el-icon>
    </template>
    <template v-else>
      <span :title="title">
        <el-icon @click="handle">
          <component :is="name"/>
        </el-icon>
      </span>
    </template>
  </template>
  <template v-else>
    <template v-if="title === ''">
      <svg :class="svgClass" aria-hidden="true" @click="handle">
        <use :xlink:href="symbolId"/>
      </svg>
    </template>
    <template v-else>
      <span :title="title">
        <svg :class="svgClass" aria-hidden="true" @click="handle">
          <use :xlink:href="symbolId"/>
        </svg>
      </span>
    </template>
  </template>

</template>

<script setup>
import {defineProps, computed} from 'vue'

const emit = defineEmits(["handle"]);
const props = defineProps({
  name: {
    type: String,
    required: true,
    default: ''
  },
  title: {
    type: String,
    default: ''
  },
  className: {
    type: String
  }
})

const symbolId = computed(() => {
  return `#icon-${props.name}`;
})
const svgClass = computed(() => {
  if (props.className) {
    return props.className
  } else {
    return 'svg-icon'
  }
})

const elementIcon = computed(() => {
  if (props.name === '') {
    return false;
  }
  if (props.name) {
    let initial = props.name.toString().substr(0, 1).charCodeAt()
    return (initial >= 65 && initial <= 90);
  }
})
const handle = () => {
  emit('handle');
}
</script>
