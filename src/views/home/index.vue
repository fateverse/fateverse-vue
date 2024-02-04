<template>
  <div class="container">
    <div id="bar1" ref="bar1"></div>
    <div id="bar2" ref="bar2"></div>
    <div id="bar3" ref="bar3"></div>
  </div>
  <div class="container">
    <div id="pie1" ref="pie1"></div>
    <div id="pie2" ref="pie2"></div>
    <div id="pie3" ref="pie3"></div>
  </div>
</template>

<script setup>
import { nextTick, onMounted, reactive } from 'vue'
import * as echarts from 'echarts'

const barOption = {
  title: {
    text: 'World Population'
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  legend: {},
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'value',
    boundaryGap: [0, 0.01]
  },
  yAxis: {
    type: 'category',
    data: ['Brazil', 'Indonesia', 'USA', 'India', 'China', 'World']
  },
  series: [
    {
      name: '2011',
      type: 'bar',
      data: [18203, 23489, 29034, 104970, 131744, 630230]
    },
    {
      name: '2012',
      type: 'bar',
      data: [19325, 23438, 31000, 121594, 134141, 681807]
    }
  ]
};

const pieOption = {
  tooltip: {
    trigger: 'item'
  },
  legend: {
    top: '5%',
    left: 'center'
  },
  series: [
    {
      name: 'Access From',
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 2
      },
      label: {
        show: false,
        position: 'center'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 40,
          fontWeight: 'bold'
        }
      },
      labelLine: {
        show: false
      },
      data: [
        { value: 1048, name: 'Search Engine' },
        { value: 735, name: 'Direct' },
        { value: 580, name: 'Email' },
        { value: 484, name: 'Union Ads' },
        { value: 300, name: 'Video Ads' }
      ]
    }
  ]
};

const data = reactive({
  barCharts: null,
  pieCharts: null,
  bar1: null,
  bar2: null,
  bar3: null,
  pie1: null,
  pie2: null,
  pie3: null,
})

const init = () => {
  data.barCharts = echarts.init(document.getElementById('bar1')).setOption(barOption)
  data.barCharts = echarts.init(document.getElementById('bar2')).setOption(barOption)
  data.barCharts = echarts.init(document.getElementById('bar3')).setOption(barOption)
  data.pieCharts = echarts.init(document.getElementById('pie1')).setOption(pieOption)
  data.pieCharts = echarts.init(document.getElementById('pie2')).setOption(pieOption)
  data.pieCharts = echarts.init(document.getElementById('pie3')).setOption(pieOption)
}

onMounted(() => {
  init()
})

window.addEventListener('resize',()=>{
  data.bar1 = null
  data.bar2 = null
  data.bar3 = null
  data.pie1 = null
  data.pie2 = null
  data.pie3 = null
  data.barCharts = null
  data.pieCharts = null
  init()
})


</script>

<style lang="scss" scoped>
.container {
  height: calc((100vh / 2) - 150px);
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  >div {
    height: 300px;
    flex: 0.9;
  }
}
</style>
