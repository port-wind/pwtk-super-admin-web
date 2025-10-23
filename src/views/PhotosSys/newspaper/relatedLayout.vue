<template>
  <el-form :model="layoutDataRef">
    <el-row style="justify-content: center">
      <el-col :span="10">
        <el-form-item label="图纸系列ID:">
          <linkWithCopy :row-data="layoutDataRef" :config="{ idKey: 'seriesCode', notShowLink: true }" />
        </el-form-item>
        <el-form-item label="报纸ID:">
          <linkWithCopy :row-data="layoutDataRef" :config="{ idKey: 'newspaperCode', notShowLink: true }" />
        </el-form-item>
        <el-form-item label="报纸名称:">
          <span>{{ layoutDataRef.newspaperName }}</span>
        </el-form-item>
        <el-form-item label="报纸简称:">
          <span>{{ layoutDataRef.newspaperShortName }}</span>
        </el-form-item>
        <el-form-item label="报纸全称:">
          <span>{{ layoutDataRef.newspaperLongName }}</span>
        </el-form-item>
        <el-form-item label="彩种:">
          <span>{{ getGameTypeName(layoutDataRef.gameType) }}</span>
        </el-form-item>
        <el-form-item label="关联版面A:">
          <linkWithCopy
            v-if="layoutDataRef.newsLayoutRelations"
            :row-data="getRelationByLayoutCode('A')"
            :config="{ idKey: 'newspaperCode', notShowLink: true }"
          />
        </el-form-item>
        <el-form-item label="关联版面B:">
          <linkWithCopy
            v-if="layoutDataRef.newsLayoutRelations"
            :row-data="getRelationByLayoutCode('B')"
            :config="{ idKey: 'newspaperCode', notShowLink: true }"
          />
        </el-form-item>
        <el-form-item label="关联版面C:">
          <linkWithCopy
            v-if="layoutDataRef.newsLayoutRelations"
            :row-data="getRelationByLayoutCode('C')"
            :config="{ idKey: 'newspaperCode', notShowLink: true }"
          />
        </el-form-item>
        <el-form-item label="关联版面D:">
          <linkWithCopy
            v-if="layoutDataRef.newsLayoutRelations"
            :row-data="getRelationByLayoutCode('D')"
            :config="{ idKey: 'newspaperCode', notShowLink: true }"
          />
        </el-form-item>
      </el-col>
      <el-col :span="10">
        <el-form-item label="彩色:">
          <span>{{ layoutDataRef.isColorful === 'y' ? '是' : '否' }}</span>
        </el-form-item>
        <el-form-item label="推荐:">
          <span>{{ layoutDataRef.isRecommended === 'y' ? '是' : '否' }}</span>
        </el-form-item>
        <el-form-item label="热门:">
          <span>{{ layoutDataRef.isHot === 'y' ? '是' : '否' }}</span>
        </el-form-item>
        <el-form-item label="置顶:">
          <span>{{ layoutDataRef.isTop === 'y' ? '是' : '否' }}</span>
        </el-form-item>
        <el-form-item label="精选:">
          <span>{{ layoutDataRef.isSelected === 'y' ? '是' : '否' }}</span>
        </el-form-item>
        <el-form-item label="爆款:">
          <span>{{ layoutDataRef.isBloom === 'y' ? '是' : '否' }}</span>
        </el-form-item>
        <el-form-item label="评论:">
          <span>{{ layoutDataRef.commentFlag === 'y' ? '是' : '否' }}</span>
        </el-form-item>
        <el-form-item label="投票:">
          <span>{{ layoutDataRef.voteFlag === 'y' ? '是' : '否' }}</span>
        </el-form-item>
        <el-form-item label="状态:">
          <span>{{ layoutDataRef.status === 'y' ? '启用' : '禁用' }}</span>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row style="justify-content: center">
      <el-col :span="20">
        <el-form-item label="报纸描述:" style="width: 90%">
          <span>{{ layoutDataRef.newspaperDesc }}</span>
        </el-form-item>
      </el-col>
      <el-col :span="20">
        <el-form-item label="备注:" style="width: 90%">
          <span>{{ layoutDataRef.memo }}</span>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script setup>
import { ref, onMounted, defineProps } from 'vue'
import { getDetailById } from '@/api/photoSys/news'
import { unitFormatDate } from '@/utils/dateFormat'
import { formateStrNum } from '@/utils/dataFormat'
const props = defineProps({
  layoutData: {
    type: Object,
    required: true
  },
  gameTypeList: {
    type: Array,
    required: true
  }
})

const layoutDataRef = ref({ ...props.layoutData })

const getGameTypeName = (gameType) => {
  const gameTypeItem = props.gameTypeList.find((item) => item.value === gameType?.toString())
  return gameTypeItem ? gameTypeItem.label : ''
}

const getRelationByLayoutCode = (layoutCode) => {
  return layoutDataRef.value.newsLayoutRelations?.find((item) => item.layoutCode === layoutCode) || {}
}

onMounted(async () => {
  if (!layoutDataRef?.value?.newspaperCode) {
    return
  }
  try {
    const response = await getDetailById({
      id: layoutDataRef.value.id,
      seriesCode: layoutDataRef.value.seriesCode,
      newspaperCode: layoutDataRef.value.newspaperCode
    })
    if (response.success && response.data) {
      layoutDataRef.value = {
        ...layoutDataRef.value,
        ...response.data,
        createTime: unitFormatDate(response.data.createTime, 'yyyy-MM-dd HH:mm:ss'),
        gameType: response.data.gameType?.toString()
      }
      console.log(layoutDataRef.value)
    } else {
      console.error('Failed to fetch layout details:', response.errMessage)
    }
  } catch (error) {
    console.error('Error fetching layout details:', error)
  }
})
</script>
