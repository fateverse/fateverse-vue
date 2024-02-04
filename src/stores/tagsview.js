import { defineStore } from "pinia";
import { ref } from "vue";
import { useRouter } from "vue-router";

export const useTagsView = defineStore('tagsView',()=>{
  const router = useRouter()
  //已显示的标签页list
  const visitedViews = ref([])

  //添加标签页面
  const addVisitedViews = ({path,meta}) => {
    if(visitedViews.value.length == 0) {
      visitedViews.value.push({path,meta})
    }else {
      const paths = visitedViews.value.map(item => item.path)
      if(paths.includes(path) == false) {
        visitedViews.value.push({path,meta})
      }
    }
  }

  //删除标签页
  const delVisitedViews = (path) => {
    if(visitedViews.value.length - 1 == 0) {
      return
    }
    visitedViews.value.forEach((item,index)=>{
      if(item.path == path) {
        visitedViews.value.splice(index,1)
      }
    })
    toLastTagView(visitedViews)
  }

  //删除其他标签页
  const delOtherVisitedViews = ({path,meta}) => {
    visitedViews.value = []
    visitedViews.value.push({path,meta})
    toLastTagView(visitedViews)
  }

  //路由到末尾标签页
  const toLastTagView = (view) => {
    const lastTagView = view.value.slice(-1)[0]
    router.push(lastTagView.path)
  }

  return {
    visitedViews,
    addVisitedViews,
    delVisitedViews,
    delOtherVisitedViews,
  }
})
