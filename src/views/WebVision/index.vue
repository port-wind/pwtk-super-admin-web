<template>
  <div class="home">
    <!-- 装修操作 -->
    <section class="operation">
      <!-- 左边内容区 九宫格布局 -->
      <sliderassembly :pointer="pointer" :pageComponent="sliderassemblyData" />

      <!-- 手机 -->
      <div class="phone">
        <section class="phoneAll" ref="imageTofile" id="imageTofile">
          <img src="@/assets/images/phoneTop.png" alt="" class="statusBar" />

          <!-- 头部导航 -->
          <headerTop v-if="pageModel !== 'componentMode'" :pageSetup="pageSetup" @click="headTop" />

          <!-- 主体内容 -->
          <section
            class="phone-container"
            :style="{
              'background-color': datas.pageSetup.bgColor,
              backgroundImage: 'url(' + datas.pageSetup.bgImg + ')'
            }"
            @drop="drop($event)"
            @dragover="allowDrop($event)"
            @dragleave="dragleave($event)"
          >
            <!-- 动态组件 -->
            <draggable
              :class="pointer.show ? 'pointer-events' : ''"
              :list="pageComponents"
              item-key="index"
              :forceFallback="true"
              :animation="200"
            >
              <template #item="{ element, index }">
                <component
                  :is="componentMap[element.component]"
                  :datas="element.setStyle"
                  :style="{
                    border: element.active && deleShow ? '2px solid #155bd4' : ''
                  }"
                  @click="activeComponent(element, index)"
                  class="componentsClass"
                  :data-type="element.type"
                >
                  <template #deles>
                    <div v-show="deleShow" class="deles">
                      <span class="icon-sanjiaoxingzuo"></span>
                      {{ element.text }}
                    </div>
                  </template>
                </component>
              </template>
            </draggable>
          </section>

          <!-- 手机高度 -->
          <div class="phoneSize">iPhone 12pro手机高度</div>
          <!-- 底部 -->
          <!-- <phone-bottom /> -->
        </section>
        <!-- 底部 -->
      </div>

      <section class="decorateAll">
        <el-tabs type="border-card" class="right-tabs" v-model="activeTab" :stretch="true">
          <el-tab-pane v-if="pageModel !== 'componentMode'">
            <template #label>
              <span class="custom-tabs-label">
                <el-icon><SetUp /></el-icon>
                <span>{{ pageModel === 'templateMode' ? '模板设置' : '站点设置' }}</span>
              </span>
            </template>
            <!-- 页面设置模块组件 -->
            <template #default>
              <decorate
                v-if="pageModel"
                :sessionCacheInfo="sessionCacheInfo"
                :pageModel="pageModel"
                :datas="datas.pageSetup"
              />
            </template>
          </el-tab-pane>
          <el-tab-pane v-if="pageModel !== 'componentMode'">
            <template #label>
              <span class="custom-tabs-label">
                <el-icon><ScaleToOriginal /></el-icon>
                <span>组件管理</span>
              </span>
            </template>
            <div class="right-tabs-contain">
              <com-management
                v-if="pageModel"
                :pageModel="pageModel"
                :datas="pageComponents"
                @componenmanagement="componenmanagement"
              />
            </div>
          </el-tab-pane>
          <el-tab-pane :disabled="!componentRightMap[choose.rightcom]">
            <template #label>
              <span class="custom-tabs-label">
                <el-icon><Edit /></el-icon>
                <span>组件设置</span>
              </span>
            </template>
            <div v-if="pageModel" class="right-tabs-contain">
              <div class="edit-json">
                <el-tooltip :content="isEditJSON ? '开启视图模式' : '开启JSON模式'" placement="left" effect="light">
                  <el-button type="primary" :icon="isEditJSON ? Operation : Edit" circle @click="toggleEditJSON" />
                </el-tooltip>
              </div>
              <component
                v-show="!isEditJSON"
                :pageModel="pageModel"
                :is="componentRightMap[choose.rightcom]"
                :datas="currentproperties"
                @submitPage="submitPage"
              />
              <!-- 无数据显示空 -->
              <!-- <el-empty
                v-show="!isEditJSON && !componentRightMap[choose.rightcom]"
                :image-size="200"
              /> -->
              <!-- 组件设置JSON模式 -->

              <editorModelStyle
                v-show="isEditJSON"
                :pageModel="pageModel"
                :datas="(currentproperties as ComponentStyle)"
                @submitJson="submitJson"
              />
            </div>
          </el-tab-pane>
        </el-tabs>
      </section>
    </section>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { cloneDeep } from 'lodash-es'
import componentProperties from '@/utils/componentProperties' // 组件数据
import sliderassembly from '@/views/WebVision/components/sliderassembly/index.vue'
import type { Choose, ComponentStyle, Data, PageComponent } from '@/views/WebVision/type'
import draggable from 'vuedraggable'
import { debounce } from 'lodash-es'
import headerTop from './components/headerTop/index.vue'
import custommodule from './components/componentscom/custommodule/index.vue'
import decorate from './components/rightslider/decorate/index.vue'

import comManagement from './components/rightslider/componenmanagement/index.vue'
import custommodulestyle from './components/rightslider/custommodulestyle/index.vue'
import templateStyle from './components/rightslider/templateStyle/index.vue'
import websiteStyle from './components/rightslider/websiteStyle/index.vue'
import editorModelStyle from './components/rightslider/editorModelStyle/index.vue'

import { editSysCom, reqSysCom } from '@/api/webgw/sysCompent'
import { addTemCom, editTemCom, regTemById, updateTemRendSeq } from '@/api/webgw/template'
import { addSitCom, editSitCom, regSitById, reqSitCom, updateSitRendSeq } from '@/api/webgw/websit'
import type { leftComponentData } from '@/views/WebVision/components/sliderassembly/type'
import { RouteLocationNormalizedLoaded, useRoute } from 'vue-router'
import { TableData } from '@/api/webgw/sysCompent/types'
import { TableData as TempTableData } from '@/api/webgw/template/types'
import { TableData as WebTableData } from '@/api/webgw/websit/types'
import { Edit, Operation } from '@element-plus/icons-vue'
import { sessionCache } from '@/hooks/useSession'
const route = useRoute()
const loadingInstance = ref()
// 创建一个组件映射对象
const componentMap = {
  custommodule: markRaw(custommodule)

  // ... 其他组件
}
const componentRightMap = {
  custommodulestyle: markRaw(custommodulestyle),
  templateStyle: markRaw(templateStyle),
  websiteStyle: markRaw(websiteStyle),
  editorModelStyle: markRaw(editorModelStyle)
  // ... 其他组件
}
const activeTab = ref('0')
const rightTabs = ref(null)
const isEditJSON = ref(false)
// let isEditJSON = false
// 页面类型
let pageModel = ref()

// const componentId = ref()
// 页面数据
const datas = reactive<Data>({
  id: null, //当前页面id
  pageSetup: {
    // 页面设置属性
    name: '页面标题', //页面名称
    details: '', //页面描述
    isPerson: false, // 是否显示个人中心
    isBack: true, // 是否返回按钮
    titleHeight: 35, // 高度getComponent
    bgColor: 'rgba(249, 249, 249, 10)', //背景颜色
    bgImg: '' // 背景图片
  },
  pageComponents: [] //页面组件
})

// 选择组件数据
const choose = reactive<Choose>({
  deleShow: true, // 删除标签显示
  index: 0, // 当前选中的index
  rightcom: 'decorate', // 右侧组件切换
  currentproperties: datas.pageSetup, // 当前属性  默认：页面设置
  offsetY: 0, //记录上一次距离父元素高度
  onlyOne: ['1-5', '1-16', 'onlyOne'], // 只能存在一个的组件(组件的type)
  pointer: { show: false } // 穿透
})

const toggleEditJSON = () => {
  isEditJSON.value = !isEditJSON.value
}

const sliderassemblyData = ref<leftComponentData[]>([])

const { id, pageSetup, pageComponents } = toRefs(datas)
const { deleShow, rightcom, currentproperties, pointer } = toRefs(choose)

//  导入json
// const importJSON = () => {
//   const file = document.getElementById('file').files[0];
//   const reader = new FileReader();
//   reader.readAsText(file);
//   let _this = datas;
//   reader.onload = function () {
//     // this.result为读取到的json字符串，需转成json对象
//     let ImportJSON = JSON.parse(this.result);
//     // 检测是否导入成功
//     console.log(ImportJSON, '-----------------导入成功');
//     // 导入JSON数据
//     _this.id = ImportJSON.id;
//     _this.pageSetup = JSON.parse(ImportJSON.templateJson);
//     _this.pageComponents = JSON.parse(ImportJSON.component);
//   };
// };
// 查看JSON
// const catJson = () => {
//   ElMessageBox.alert(
//     `{
//           <br/>
//           "id": ${datas.id},
//           <br/>
//           "name": "${datas.pageSetup.name}",
//           <br/>
//           "templateJson": '${JSON.stringify(datas.pageSetup)}',
//           <br/>
//           "component": '${JSON.stringify(datas.pageComponents)}',
//           <br/>
//         }`,
//     '查看JSON',
//     {
//       confirmButtonText: '确定',
//       customClass: 'JSONView',
//       dangerouslyUseHTMLString: true,
//       callback: () => {}
//     }
//   )
// }
/**
 * 选择组件
 *
 * @param {Object} res 当前组件对象
 */
const activeComponent = (res, index) => {
  // console.log('res', res)
  activeTab.value = '2'
  choose.index = index
  /* 切换组件 */
  choose.rightcom = res.style
  /* 丢样式 */
  choose.currentproperties = res.setStyle

  /* 替换 */
  datas.pageComponents.forEach((res) => {
    /* 修改选中 */
    if (res.active === true) res.active = false
  })

  /* 选中样式 */
  res.active = true
}

// 切换标题
const headTop = () => {
  choose.rightcom = 'decorate'
  /* 替换 */
  datas.pageComponents.forEach((res) => {
    /* 修改选中 */
    if (res.active === true) res.active = false
  })
}
/**
 * 添加模板组件
 * @param {Object} data - 组件数据
 */
const addTemComponent = async (data) => {
  try {
    const res = await addTemCom({
      templateId: searchId,
      componentName: data.text,
      componentType: data.type
    })

    if (res.success) {
      return {
        ...data,
        componentId: res.data,
        setStyle: {
          ...data.setStyle,
          componentId: res.data
        }
      }
    } else {
      ElMessage({
        showClose: true,
        message: res.errMessage,
        type: 'error'
      })
      return false
    }
  } catch (err) {
    console.log(err, 'err')
    return false
  }
}
/**
 * 添加站点组件
 * @param {Object} data - 组件数据
 */
const addSitComponent = async (data) => {
  try {
    const res = await addSitCom({
      websiteId: searchId,
      componentName: data.text,
      componentType: data.type
    })

    if (res.success) {
      return {
        ...data,
        componentId: res?.data,
        setStyle: {
          ...data.setStyle,
          componentId: res?.data
        }
      }
    } else {
      ElMessage({
        showClose: true,
        message: res.errMessage,
        type: 'error'
      })
      return false
    }
  } catch (err) {
    console.log(err, 'err')
    return false
  }
}
/**
 * 当拖动的元素或文本选择离开有效的放置目标时，会触发此事件
 *
 * @param {Object} event event对象
 */
const dragleave = (event: DragEvent) => {
  /* 删除提示组件 */
  datas.pageComponents = datas.pageComponents.filter((res) => res.component !== 'placementarea')
}

/**
 * 当在有效放置目标上放置元素或选择文本时触发此事件
 * 拖动完成后触发
 *
 * @param {Object} event event对象
 */
const drop = async (event) => {
  /* 获取数据 */
  // console.log('drop', event)
  // console.log('componentName', event.dataTransfer.getData('componentName'))
  let data = cloneDeep(componentProperties.get(event.dataTransfer.getData('componentName')))
  // console.log('drop_data=======', data)

  /* 查询是否只能存在一个的组件且在第一个 */
  // let someOne = datas.pageComponents.some((item, index) => {
  //   return item.component === 'placementarea' && index === 0 && choose.onlyOne.includes(data.type)
  // })
  // if (someOne) {
  //   ElMessage.info('固定位置的组件(如: 底部导航、悬浮)不能放在第一个!')
  //   /* 删除提示组件 */
  //   dragleave(event)
  //   return
  // }

  /* 查询是否只能存在一个的组件 */
  let someResult = datas.pageComponents.some((item) => {
    return choose.onlyOne.includes(item.type) && item.component === event.dataTransfer.getData('componentName')
  })
  // console.log('someResult', someResult)
  if (someResult) {
    // console.log('someResult', someResult)
    ElMessage.info('当前组件只能添加一个!')
    /* 删除提示组件 */
    dragleave(event)
    return
  }
  // 添加组件并与后台同步
  if (pageModel.value === 'templateMode') {
    const newData = await addTemComponent(data)
    // 添加失败则拖拽退回
    if (!newData) {
      dragleave(event)
      return
    }
    data = newData
  }
  if (pageModel.value === 'websiteMode') {
    const newData = await addSitComponent(data)
    // 添加失败则拖拽退回
    if (!newData) {
      dragleave(event)
      return
    }
    data = newData
  }

  /* 替换 */
  datas.pageComponents.forEach((res, index) => {
    /* 修改选中 */
    if (res.active === true) res.active = false

    /* 替换提示 */
    choose.index = index
    if (res.component === 'placementarea') {
      // console.log('替换data', data)
      datas.pageComponents[index] = data
    }
  })

  /* 切换组件 */
  choose.rightcom = data.style
  /* 丢样式 */
  choose.currentproperties = data.setStyle
  activeTab.value = '2'
  // console.log(pageComponents, '-----------------pageComponents')
  // console.log(data, choose.currentproperties, '----------currentproperties data')
  // console.log(data, choose.rightcom, choose.currentproperties, '----------components data')
}

/**
 * 当将元素或文本选择拖动到有效放置目标（每几百毫秒）上时，会触发此事件
 *
 * @param {Object} event event对象
 */
const allowDrop = (event: DragEvent) => {
  //阻止浏览器的默认事件
  event.preventDefault()
  /* 获取鼠标高度 */
  let eventoffset = event.offsetY

  /* 如果没有移动不触发事件减少损耗 */
  if (choose.offsetY === eventoffset) return
  else choose.offsetY = eventoffset
  // console.log('event', event);

  /* 获取组件 */
  const childrenObject = (event.target as HTMLElement)?.children?.[0]
  // console.log('datas.pageComponents', datas.pageComponents)
  // console.log('datas.length', datas.pageComponents.length)

  // 一个以上的组件计算
  if (datas.pageComponents.length) {
    /* 如果只有一个组件并且第一个是提示组件直接返回 */
    if (datas.pageComponents.length === 1 && datas.pageComponents[0].type === '0') return

    /* 如果鼠标的高度小于第一个的一半直接放到第一个 */
    if (eventoffset < childrenObject.children[0].clientHeight / 2) {
      /* 如果第一个是提示组件直接返回 */
      if (datas.pageComponents[0].type === '0') return

      /* 删除提示组件 */
      datas.pageComponents = datas.pageComponents.filter((res) => res.component !== 'placementarea')
      /* 最后面添加提示组件 */
      datas.pageComponents.unshift({
        component: 'placementarea',
        type: '0'
      })

      return
    }

    /* 记录距离父元素高度 */
    const childOff = (childrenObject as HTMLElement).offsetTop

    /* 鼠标在所有组件下面 */
    if (
      eventoffset > childrenObject.clientHeight ||
      (childrenObject.lastChild &&
        (childrenObject.lastChild as HTMLElement).offsetTop -
          childOff +
          (childrenObject.lastChild as HTMLElement).clientHeight / 2 <
          eventoffset)
    ) {
      /* 最后一个组件是提示组件返回 */
      if (datas.pageComponents[datas.pageComponents.length - 1].type === '0') return

      /* 清除提示组件 */
      datas.pageComponents = datas.pageComponents.filter((res) => res.component !== 'placementarea')
      /* 最后一个不是提示组件添加 */
      datas.pageComponents.push({
        component: 'placementarea',
        type: '0'
      })
      return
    }

    const childrens = childrenObject.children

    /* 在两个组件中间，插入 */
    for (let i = 0, l = childrens.length; i < l; i++) {
      const childoffset = (childrens[i] as HTMLElement).offsetTop - childOff

      if (childoffset + childrens[i].clientHeight / 2 > event.offsetY) {
        /* 如果是提示组件直接返回 */
        if (datas.pageComponents[i].type === '0') break

        if (datas.pageComponents[i - 1].type === '0') break

        /* 清除提示组件 */
        datas.pageComponents = datas.pageComponents.filter((res) => res.component !== 'placementarea')
        datas.pageComponents.splice(i, 0, {
          component: 'placementarea',
          type: '0'
        })
        break
      } else if (childoffset + childrens[i].clientHeight > event.offsetY) {
        if (datas.pageComponents[i].type === ' 0') break

        if (!datas.pageComponents[i + 1] || datas.pageComponents[i + 1].type === '0') break

        datas.pageComponents = datas.pageComponents.filter((res) => res.component !== 'placementarea')
        datas.pageComponents.splice(i, 0, {
          component: 'placementarea',
          type: '0'
        })

        break
      }
    }
  } else {
    /* 一个组件都没有直接push */
    datas.pageComponents.push({
      component: 'placementarea',
      type: '0'
    })
  }
}

/**
 * 切换组件位置  用于组件管理中删除功能
 *
 * @param {Object} res 组件切换后返回的位置
 */
const componenmanagement = (res) => {
  // console.log('res', res)
  datas.pageComponents = res
}

const submitJson = async (res) => {
  let getAPI: any
  switch (pageModel.value) {
    case 'templateMode':
      getAPI = editTemCom
      break
    case 'websiteMode':
      getAPI = editSitCom
      break
    case 'componentMode':
      getAPI = editSysCom
      break
  }
  try {
    const param = cloneDeep(res)
    // // param.configParamJson = param.configParamJson
    // console.log(param, 'param')

    const response = await getAPI({
      // componentId: datas.pageComponents[choose.index].componentId ?? '',
      // configParamJson: JSON.stringify(res.jsonData)
      ...param
    })
    if (response && response.success) {
      // console.log('response', response)

      ElMessage({
        showClose: true,
        message: response.errMessage,
        type: 'success'
      })
      sliderassemblyData.value = []
      datas.pageComponents = []
      initFetchData()
    } else {
      ElMessage({
        showClose: true,
        message: response.errMessage,
        type: 'error'
      })
    }
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}

const submitPage = async (res) => {
  console.log(res, 'res')
}

const initFetchData = async () => {
  let getAPI: any
  let params: any
  switch (pageModel.value) {
    case 'templateMode':
      getAPI = regTemById
      params = {
        templateId: searchId
      }
      break
    case 'websiteMode':
      getAPI = regSitById
      params = {
        websiteId: searchId
      }
      break
    case 'componentMode':
      getAPI = reqSysCom
      params = {
        componentId: searchId,
        page: 1,
        size: 100
      }
      break
  }

  // const queryKey = Object.keys(query).find((key) => key in apiMap)
  // const getAPI = queryKey ? apiMap[queryKey] : null

  if (!getAPI) {
    console.error('Invalid query parameters')
    return
  }
  try {
    const response = await getAPI({
      ...params
    })
    if (response && response.success) {
      // console.log(response, 'response.data')
      switch (pageModel.value) {
        case 'componentMode':
          getComponentId(response.data.list)
          break
        case 'templateMode':
          getTemplateId(response.data)
          break
        case 'websiteMode':
          getWebsiteId(response.data)
          break
      }
      // pageComponents.value
    } else {
      ElMessage({
        showClose: true,
        message: response.errMessage,
        type: 'error'
      })
    }
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}

//页面组件库 后台加载后的数据(系统组件)
const getComponentId = (param: TableData[]) => {
  // console.log(param, 'param')
  // const existingData = componentProperties.get('custommodule')
  // if (existingData) {
  //   existingData.componentId = _data.componentId
  //   existingData.type = 'onlyOne'
  //   existingData.setStyle.name = _data.componentName
  //   existingData.setStyle.json = _data.configParamJson
  //   componentProperties.set('custommodule', existingData)
  // }
  // PageComponent
  param.forEach((_data, index) => {
    const newData = {
      text: _data.componentName,
      type: _data.componentType,
      icon: '',
      name: 'custommodule',
      disabled: true
    }
    sliderassemblyData.value.push(newData)

    const pageComponent = {
      active: true,
      component: 'custommodule',
      componentId: _data.componentId,
      setStyle: {
        componentId: _data.componentId,
        componentName: _data.componentName,
        configParamJson: _data.configParamJson
      },
      style: 'custommodulestyle',
      text: _data.componentName,
      type: 'onlyOne'
    }
    datas.pageComponents.push(pageComponent)

    // 只在第一个元素上设置选中状态
    if (index === 0) {
      choose.index = 0
      // 设置右侧组件 这里后续要改成 组件的名称
      choose.rightcom = 'custommodulestyle'
      choose.currentproperties = pageComponent.setStyle
      currentproperties.value = pageComponent.setStyle
    }
  })
}

//模板组件库 后台加载后的数据
const getTemplateId = (param: TempTableData[]) => {
  // console.log(param, 'TempTableData')
  if (param.length === 0) return
  isInitialLoad.value = true
  param.forEach((_data, index) => {
    const pageComponent = {
      active: false,
      component: 'custommodule',
      componentId: String(_data.componentId),
      pageRenderingSeq: Number(_data.pageRenderingSeq),
      setStyle: {
        componentId: String(_data.componentId),
        componentName: _data.componentName,
        configParamJson: _data.configParamJson
      },
      style: 'templateStyle',
      text: _data.componentName,
      type: _data.componentType
    }
    datas.pageComponents.push(pageComponent)
  })
}

//网站组件库 后台加载后的数据
const getWebsiteId = (param: WebTableData[]) => {
  // console.log(param, 'WebTableData')
  if (param.length === 0) return
  isInitialLoad.value = true
  param.forEach((_data) => {
    const pageComponent = {
      active: false,
      component: 'custommodule',
      componentId: String(_data.componentId),
      pageRenderingSeq: Number(_data.pageRenderingSeq),
      setStyle: {
        componentId: String(_data.componentId),
        componentName: _data.componentName,
        configParamJson: _data.configParamJson
      },
      style: 'websiteStyle',
      text: _data.componentName,
      type: _data.componentType
    }
    datas.pageComponents.push(pageComponent)
  })
}

/**
 * 1. 请求系统组件列表
 * 2. 将组件push到sliderassemblyData
 * 3. 保存组件的基本信息到componentProperties
 */
const getComponent = () => {
  reqSysCom({ page: 1, size: 100 })
    .then((res) => {
      if (res.success) {
        // console.log(res, 'res')
        res.data?.list.forEach((_data, index) => {
          const newData = {
            text: _data.componentName,
            type: _data.componentType,
            icon: '',
            name: _data.componentType,
            disabled: false
          }
          sliderassemblyData.value.push(newData)

          // 保存组件的基本信息到componentProperties
          componentProperties.set(_data.componentType, {
            component: 'custommodule',
            text: _data.componentName,
            type: _data.componentType,
            active: true,
            style: pageModel.value === 'templateMode' ? 'templateStyle' : 'websiteStyle',
            setStyle: {
              componentId: '',
              componentName: _data.componentName,
              configParamJson: _data.configParamJson
            }
          })
        })
      } else {
        ElMessage({
          showClose: true,
          message: res.errMessage,
          type: 'error'
        })
      }
    })
    .catch((error) => {
      console.error('请求过程中发生错误:', error)
    })
}

/**
 * 保存当前页面的组件顺序
 * @returns {Promise<AxiosResponse<updateRendSeqResponse>>}
 */
const saveTemRend = async () => {
  const formattedList = datas.pageComponents
    .filter((component): component is PageComponent & { componentId: string } => component.componentId !== undefined)
    .map((component, index) => ({
      componentId: component.componentId,
      componentName: component.text || '',
      componentType: component.type,
      pageRenderingSeq: (index + 1).toString()
      // configParamJson: component.setStyle?.configParamJson || ''
    }))

  if (formattedList.length === 0) return
  if (pageModel.value === 'templateMode') {
    await updateTemRendSeq({
      templateId: searchId,
      list: formattedList
    })
      .then((res) => {
        if (res.success) {
          ElMessage.success('状态已更新')
        } else {
          ElMessage.error('状态更新失败')
        }
      })
      .catch((error) => {
        console.error('请求过程中发生错误:', error)
      })
  }
  if (pageModel.value === 'websiteMode') {
    await updateSitRendSeq({
      websiteId: searchId,
      list: formattedList
    })
      .then((res) => {
        if (res.success) {
          ElMessage.success('状态已更新')
        } else {
          ElMessage.error('状态更新失败')
        }
      })
      .catch((error) => {
        console.error('请求过程中发生错误:', error)
      })
  }
}
const isInitialLoad = ref(false)
// 防抖
const debouncedSaveTemRend = debounce(saveTemRend, 500)
let previousComponentIds: string[] = []

// 监听页面组件变化 顺序变化后 与后台同步
watchEffect(() => {
  if (isInitialLoad.value) {
    isInitialLoad.value = false
    previousComponentIds = pageComponents.value
      .map((comp) => comp.componentId)
      .filter((id): id is string => id !== undefined)
    return
  }

  const currentComponentIds = pageComponents.value
    .map((comp) => comp.componentId)
    .filter((id): id is string => id !== undefined)

  // 检查数组长度或顺序是否发生变化
  if (
    currentComponentIds.length !== previousComponentIds.length ||
    !currentComponentIds.every((id, index) => id === previousComponentIds[index])
  ) {
    // console.log('Components have changed (added, removed, or reordered)')
    debouncedSaveTemRend()
  }

  previousComponentIds = currentComponentIds
})
let searchId: string = ''
let sessionCacheInfo: any

onMounted(() => {
  try {
    // 获取完整的 hash 值
    if (route.query.templateId) {
      getComponent()
      pageModel.value = 'templateMode'
      searchId = route.query.templateId as string
      sessionCacheInfo = sessionCache.getCache('templateRowInfo')
    } else if (route.query.websiteId) {
      getComponent()
      pageModel.value = 'websiteMode'
      searchId = route.query.websiteId as string
      sessionCacheInfo = sessionCache.getCache('siteRowInfo')
    } else if (route.query.componentId) {
      pageModel.value = 'componentMode'
      searchId = route.query.componentId as string
    }
    if (!searchId) {
      throw new Error(`${searchId} 不能为空`)
    }

    initFetchData()
  } catch (error) {
    console.error('Error in mounted hook:', error)
    ElMessage.error('初始化过程中发生错误')
  }
})

onUnmounted(() => {
  sessionCache.deleteCache('templateRowInfo')
  sessionCache.deleteCache('siteRowInfo')
})
</script>

<style lang="less" scoped>
/* // 页面切换动画 */
.layoutFade-enter-active {
  transition: all 1.5s ease;
}
.layoutFade-leave-active {
  transition: all 1.5s ease;
}
.layoutFade-enter {
  transform: translateY(5px);
  opacity: 0;
}
.layoutFade-leave-to {
  transform: translateY(5px);
  opacity: 0;
}
.pointer-events {
  pointer-events: none;
}

.home {
  width: 100%;
  height: 100%;
  overflow: hidden;

  /* 删除组件 */
  .deles {
    position: absolute;
    min-width: 80px;
    text-align: center;
    line-height: 25px;
    background: #fff;
    height: 25px;
    font-size: 12px;
    left: 103%;
    top: 50%;
    transform: translateY(-50%);
    .icon-sanjiaoxingzuo {
      position: absolute;
      left: -10px;
      top: 50%;
      transform: translateY(-50%);
      width: 0;
      height: 0;
      border-top: 5px solid transparent;
      border-bottom: 5px solid transparent;
      border-right: 10px solid #fff;
    }
    &:hover {
      .icon-sanjiaoxingzuo {
        border-right-color: rgba(0, 0, 0, 0.5);
      }
      background: rgba(0, 0, 0, 0.5);
    }

    i {
      display: none;
    }
  }

  /* 按钮集合 */
  .buttons {
    height: 3rem;
    border-bottom: 1px solid #ebedf0;
    display: flex;
    justify-content: space-between;
    box-sizing: border-box;
    padding-right: 15px;
    align-items: center;
    /* 下拉 */
    .frop {
      padding-right: 15px;
      .el-button.el-button--primary.el-dropdown-selfdefine {
        background: #fff;
        color: #000;
        border: 1px solid #dcdee0;
      }
    }
    .el-button {
      font-size: 14px;
      padding: 0 16px;
      height: 30px;
      &.el-button--primary {
        background: #155bd4;
      }
      &.el-button--danger {
        background: red;
      }
    }
  }

  /* 操作主体 */
  .operation {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    background: #f7f8fa;
  }

  /* 手机 */
  .phone {
    width: 55%;
    height: 100%;
    overflow-y: scroll;
    display: flex;
    justify-content: center;
    background: #f7f8fa;
    &::-webkit-scrollbar {
      width: 1px;
    }
    // &::-webkit-scrollbar-thumb {
    //   background-color: #155bd4;
    // }

    /* 手机样式 */
    .phoneAll {
      width: 390px;
      min-height: 760px;
      box-shadow: 0 0 14px 0 rgba(0, 0, 0, 0.1);
      margin: 1.5rem 0;
      position: relative;
      // overflow-y: scroll;

      /* 手机高度 */
      .phoneSize {
        position: absolute;
        left: -137px;
        top: 844px;
        font-size: 12px;
        color: #a2a2a2;
        border-bottom: 1px solid #dedede;
        width: 130px;
        height: 21px;
        line-height: 21px;
      }

      /* 状态栏 */
      .statusBar {
        width: 100%;
        display: block;
      }

      /* 主体内容 */
      .phone-container {
        min-height: 807px;
        box-sizing: border-box;
        cursor: pointer;
        width: 100%;
        position: relative;
        background-repeat: no-repeat;
        background-size: 100% 100%;
        .componentsClass {
          border: 1px solid #fff;
          &:hover {
            border: 1px dashed #155bd4;
          }
        }
      }
    }
  }

  /* 右侧工具栏 */
  .decorateAll {
    width: 40rem;
    height: 100%;
    overflow-y: scroll;
    overflow-x: hidden;
    position: relative;
    padding: 0;
    background: #fff;
    &::-webkit-scrollbar {
      width: 1px;
    }
    &::-webkit-scrollbar-thumb {
      background-color: #155bd4;
    }
  }

  /* 页面设置tab */
  .decorateTab {
    position: fixed;
    display: flex;
    right: 380px;
    top: 115px;
    flex-direction: column;
    span {
      background-color: #fff;
      box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.1);
      border-radius: 2px;
      width: 94px;
      height: 32px;
      display: inline-block;
      text-align: center;
      line-height: 32px;
      margin-bottom: 12px;
      transition: all 0.8s;
      cursor: pointer;
      &.active {
        background-color: #155bd4;
        color: #fff;
      }
      /* 图标 */
      i {
        font-size: 12px;
        margin-right: 5px;
      }
    }
  }
}

// /* 动画 */
// .decorateAnima-enter-active {
//   transition: all 1.5s ease;
// }
// .decorateAnima-leave-active {
//   transition: all 1.5s ease;
// }
// .decorateAnima-enter {
//   transform: translate(8px, 8px);
//   opacity: 0;
// }
// .decorateAnima-leave-to {
//   transform: translate(8px, 8px);
//   opacity: 0;
// }

// =========================================== Tabs 样式 ========================================
.right-tabs {
  height: 100%;
}
.edit-json {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.right-tabs .custom-tabs-label .el-icon {
  vertical-align: middle;
}
.right-tabs .custom-tabs-label span {
  vertical-align: middle;
  margin-left: 4px;
}
</style>
