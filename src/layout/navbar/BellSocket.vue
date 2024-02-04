<template>
  <div>
    <el-popover
        :width="300"
        trigger="click"
        :disabled="total===0"
        placement="bottom"
        popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; padding: 10px;"
    >
      <template #reference>
        <el-badge :hidden="total===0" :value="total" class="item">
          <el-icon size="22px" style="cursor: pointer">
            <Bell/>
          </el-icon>
        </el-badge>
      </template>
      <template #default>
        <ul>
          <li v-for="(notice,index) in noticeList" :key="index">
            <span @click="handleToNotifyDetail(notice,index)">{{ notice.noticeTitle }}</span>
            <span v-if="notice.state==='0'" @click="handleRead(notice)">已读</span>
          </li>
        </ul>
        <div class="notify-btn">
          <el-button type="primary" @click="handlePrevious" :disabled="pageInfo.pageNum===1" link>上一页</el-button>
          <span @click="handleMoreRead">本页已读</span>
          <el-button type="primary" @click="handleNext" :disabled="pageInfo.pageNum*pageInfo.pageSize>total" link>下一页
          </el-button>
        </div>
      </template>
    </el-popover>
    <el-dialog width="1200px" title="通知公告详情" v-model="visible" @close="visible=false">
      <el-form :model="viewForm" label-width="100px">
        <el-row>
          <el-col :span="24" class="title-block">
            <el-text class="title">{{ viewForm.noticeTitle }}</el-text>
          </el-col>
          <el-col :span="24">
            <el-text v-if="viewForm.contentType === 'text'">{{ viewForm.noticeContent }}</el-text>
            <span v-else v-html="viewForm.noticeContent"></span>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup>
import {getNotifyList, getNotifyDetail, readAllNotify, readSingleNotify} from "@/api/notice/notify";
import {getToken} from '@/utils/auth'
import {ElMessage} from "element-plus";
import {useRouter} from "vue-router";
// import {defineExpose} from "vue";

const router = useRouter()
const pageInfo = reactive({
  pageNum: 1,
  pageSize: 8
})
let send = {
  type: "ping"
}
const viewForm = ref();
const visible = ref(false);
const showNotify = ref(false);
const total = ref();
const noticeList = ref();
//查看详情
const handleViewDetails = (noticeId) => {
  getNotifyDetail(noticeId).then(res => {
    visible.value = true
    viewForm.value = res.data
  })
}
const setWsUrl=(url)=>{
  return (window.location.protocol === 'http:' ? "ws://" : "wss://")+window.location.host + import.meta.env.VITE_BASE_URL + url;
}
const initWebSocket = () => {
  try {
    //怎么区分http  https  /url(全局url)  封装url  只填个url？
    const wsUrl=setWsUrl('/notice-ws/notice')
    const socket = new WebSocket(wsUrl)
    // 2. ws.send()给服务器发送信息
    //连接发生错误的回调方法
    socket.onerror = function () {
      console.log("ws连接发生错误");
    };
    //连接成功建立的回调方法
    socket.onopen = function () {
      let authInfo = {
        token: getToken(),
        type: "auth",
        cluster: "notice"
      }
      socket.send(JSON.stringify(authInfo))
      console.log("ws连接成功");
    }
    //接收到消息的回调方法
    socket.onmessage = function (event) {
      let data = JSON.parse(event.data)
      if (data.type === 'notice') {
        noticeList.value.push(data.notice)
        total.value += 1
      }
      // console.log("服务器返回的信息: ", JSON.parse(event.data));
    }
    //连接关闭的回调方法
    socket.onclose = function () {
      // initWebSocket()
      console.log("ws连接关闭");
    }
    setInterval(() => {
      socket.send(JSON.stringify(send))
    }, 30000)
  } catch (e) {
    console.log(e)
    console.log("ws连接失败");
  }
}
initWebSocket()

const searchNotifyList = () => {
  let params = {
    cluster: "notice",
    state: 0,
    ...pageInfo
  }
  getNotifyList(params).then(res => {
    console.log("获取到个人公告", res)
    if (res.data) {
      noticeList.value = res.data.rows
      total.value = res.data.total
    }
    // initWebSocket()
  })
}
searchNotifyList()

//点击名字跳转到详情页
const handleToNotifyDetail = (notice, index) => {
  noticeList.value.splice(index, 1)
  total.value -= 1
  viewForm.value = {
    noticeTitle: '',
    noticeContent: ''
  }
  // router.push({path: `/system/notice/inform/index/${notice.noticeId}`})
  handleViewDetails(notice.noticeId)
}

//单个已读
const handleRead = (notice) => {
  readSingleNotify(notice.noticeId).then(res => {
    if (res.code === 1000) {
      ElMessage.success(res.msg)
      searchNotifyList()
    } else {
      ElMessage.error(res.msg)
    }
  })
}
//本页已读
const handleMoreRead = () => {
  let notifyIds = []
  noticeList.value.forEach(item => {
    notifyIds.push(item.noticeId)
  })
  readAllNotify(notifyIds).then(res => {
    if (res.code === 1000) {
      ElMessage.success(res.msg)
      searchNotifyList()
    } else {
      ElMessage.error(res.msg)
    }
  })
}
//上一页
const handlePrevious = () => {
  if (pageInfo.pageNum !== 1) {
    pageInfo.pageNum -= 1
    searchNotifyList()
  }
}

//下一页
const handleNext = () => {
  if (pageInfo.pageNum * pageInfo.pageSize <= total.value) {
    pageInfo.pageNum += 1
    searchNotifyList()
  }
}
// onMounted(() => {
//
// });
// 组件被销毁之前，清空 sock 对象
// onBeforeUnmount(() => {
//   // 关闭连接
//   // 销毁 websocket 实例对象
//   // socket = null;
// });
// defineExpose({
//   searchNotifyList
// })
</script>

<style lang="scss" scoped>
.title-block {
  text-align: center;
  padding-bottom: 30px;

  .title {
    font-size: 28px;
    font-weight: bold;
  }
}

ul::-webkit-scrollbar {
  width: 6px;
}

// 滚动条轨道
ul::-webkit-scrollbar-track {
  background: rgb(239, 239, 239);
  border-radius: 2px;
}

// 小滑块
ul::-webkit-scrollbar-thumb {
  background: rgba(80, 81, 82, 0.29);
  border-radius: 10px;
}

ul {
  height: 100px;
  overflow-y: auto;
  padding: 0 10px;
  margin-bottom: 10px;

  li {
    height: 25px;
    line-height: 25px;
    overflow-y: auto;
    display: flex;
    justify-content: space-between;

    span:first-child:hover {
      color: #2a99ff;
      cursor: pointer;
    }

    span:last-child {
      color: #2a99ff;
      cursor: pointer;
    }
  }
}

.notify-btn {
  display: flex;
  justify-content: space-between;
  align-items: center;

  span {
    color: #2a99ff;
    cursor: pointer;
  }
}
</style>
