import {defineStore} from "pinia";
import {ref} from "vue";


export const useProcessStore = defineStore('process', () => {
    const nodeMap = ref(new Map())
    const parentMap = ref(new Map())
    const selectUserMap = ref(new Map())
    const isEdit = ref(null)
    const selectFormItem = ref(null)
    const selectedNode = ref([])
    const runningList = ref([])
    const endList = ref([])
    const noTakeList = ref([])
    const refuseList = ref([])
    const passList = ref([])
    const processData = ref({})
    const userTaskOption = ref({})

    const getSelectedNode = () => {
        return selectedNode.value
    }
    const setSelectedNode = (val) => {
        selectedNode.value = val
    }
    const getSelectedFormItem = () => {
        return selectFormItem.value
    }
    const setSelectedFormItem = (val) => {
        selectFormItem.value = val
    }

    const getProcess = () => {
        return processData.value.process;
    }

    const addProcess = (val) => {
        console.log("添加节点成功")
        processData.value.process.push(val)
    }
    const delProcess = (delNode) => {
        processData.value.process.splice(processData.value.process.indexOf(delNode), 1)
        console.log("删除数据")
        console.log(processData.value.process)
    }

    const getDesign = () => {
        return processData.value
    }
    const getAssignedUser = () => {
        return selectedNode.value.props.assignedUser || []
    }


    const addAssignedUser = (val) => {
        selectedNode.value.props.assignedUser.push(val)
    }


    const getFormMap = () => {
        //表单映射对象
        const map = new Map();
        processData.value.formItems.forEach(item => itemToMap(map, item))
        return map
    }

    const itemToMap = (map, item) => {
        //对象转map
        map.set(item.id, item)
        if (item.name === 'SpanLayout') {
            item.props.items.forEach(sub => itemToMap(map, sub))
        }
    }

    const setDesign = (val) => {
        processData.value = val
    }

    const init = () => {
        nodeMap.value.clear()
        parentMap.value.clear()
    }

    return {
        nodeMap,
        parentMap,
        selectUserMap,
        isEdit,
        selectFormItem,
        runningList,
        endList,
        noTakeList,
        refuseList,
        passList,
        design: processData,
        selectedNode,
        userTaskOption,
        init,
        getSelectedNode,
        setSelectedNode,
        getSelectedFormItem,
        setSelectedFormItem,
        getDesign,
        setDesign,
        getProcess,
        addProcess,
        delProcess,
        getFormMap,
        getAssignedUser,
        addAssignedUser
    }
})