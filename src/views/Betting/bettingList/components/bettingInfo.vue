<template>
  <el-form ref="formRef" :model="formData" :rule="rules" class="dialog-form" v-loading="isBettingDetailLoading">
    <el-row>
      <el-col :span="12">
        <el-form-item label="玩法类型:" prop="playTypeCode">
          <el-select v-model="formData.playTypeCode" placeholder="请投票类型">
            <el-option
              v-for="item in bettingStore.gameListTypeCode"
              :key="item.playTypeCode"
              :label="item.predictionTypeName"
              :value="item.playTypeCode"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="玩法状态:" prop="status">
          <el-radio-group :disabled="!formData.playTypeCode" v-model="formData.status">
            <el-radio value="y">启用</el-radio>
            <el-radio value="n">关闭</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row v-if="formData.playTypeCode">
      <el-col :span="12">
        <el-form-item label="玩法规则:" prop="rule">
          <el-text>「&nbsp;{{ game_name }}&nbsp;」{{ game_rule }}</el-text>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="参考内容:" prop="refer">
          <el-text>{{ refer_content }}</el-text>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item
          :label="game_rule_detail_name"
          label-width="200"
          prop="game"
          class="custom_text_area"
        ></el-form-item>
      </el-col>
      <el-col :span="12">
        <div class="game_result_wrapper">
          <el-form-item label="生肖:" prop="game_result" label-width="50">
            <GameView :zodiac-list="zodiacList"></GameView>
            <!-- <ul class="game_list">
              <li v-for="item in zodiacList">
                {{ item }}
              </li>
            </ul> -->
          </el-form-item>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <!-- <el-form-item
          :label="game_rule_detail_name"
          label-width="200"
          prop="game"
          class="custom_text_area"
        ></el-form-item> -->
      </el-col>
    </el-row>
    <el-row v-if="formData.playTypeCode">
      <el-col :span="12">
        <el-text class="rule_explain">
          {{ ruleExplain }}
        </el-text>
      </el-col>
    </el-row>
  </el-form>
  <div class="button-row">
    <el-button type="primary" :loading="isLoading" @click="onSubmit">提交</el-button>
  </div>
</template>
<script setup lang="ts">
import { reactive, watch, ref, onMounted } from 'vue'
import { useBettingStore } from '@/stores/bettingStore'
import { FormInstance, FormRules } from 'element-plus'
import { getGameDetailByPlayTypeCode, IGetGameDetailByPlayTypeCode, predictTypeEditStatus } from '@/api/betting'
import { IGameTypePlayDetailsData, IPredictTypeEditStatusBodyParameter } from '@/api/betting/types'
import showErrorMessage from '@/utils/showErrorMessage'
import GameView from '@/views/Betting/bettingList/components/gameView.vue'
const bettingStore = useBettingStore()
const isLoading = ref(false)
const isBettingDetailLoading = ref(false)
// 表单引用
const formRef = ref<FormInstance>()

const formData = reactive<IPredictTypeEditStatusBodyParameter>({
  playTypeCode: '',
  bizFlag: 't',
  status: 'n'
})
const zodiacList = ref<string[]>([])
const game_name = ref<string>('')
const game_rule = ref<string>('')
const ruleExplain = ref<string>('')
const game_rule_detail_name = ref<string>('「 」的玩法：') //「{{game_name}}」的玩法：
const refer_content = ref<string>('最少选择「 」个,至多选择「 」个')
const chineseNumbers = {
  '1': '一',
  '2': '二',
  '3': '三',
  '4': '四',
  '5': '五',
  '6': '六',
  '7': '七',
  '8': '八',
  '9': '九',
  '0': '零'
}

// 表单规则
const rules: FormRules = {
  playTypeCode: [{ required: true, message: '请选择一个玩法' }],
  status: [{ required: true, message: '请选择一个玩法状态' }]
}

const onSubmit = async () => {
  isLoading.value = true
  try {
    formRef.value?.validate(async (valid) => {
      if (valid) {
        const res = await predictTypeEditStatus(formData)
        if (res.success) {
          ElMessage({
            message: '更新好了',
            type: 'success'
          })
        } else {
          showErrorMessage(res)
        }
      } else {
        console.error('表单验证失败!')
      }
      isLoading.value = false
    })
  } catch (error) {
    console.error(error)
    isLoading.value = false
  } finally {
    isLoading.value = false
  }
}

watch(
  () => formData.playTypeCode,
  async () => {
    await getGameDetail()
  }
)

const getGameDetail = async () => {
  try {
    isBettingDetailLoading.value = true
    const data: IGetGameDetailByPlayTypeCode = {
      bizFlag: 't',
      playTypeCode: formData.playTypeCode
    }
    const res = await getGameDetailByPlayTypeCode(data)
    if (res.data) {
      zodiacList.value = res.data.optionList
      game_name.value = res.data.predictionTypeName
      ruleExplain.value = res.data.ruleExplain
      game_rule_detail_name.value = `「${res.data.predictionTypeName}」的玩法:`
      refer_content.value = setRefer_content(res.data) // `'最少选择「 ${}」个,至多选择「${}」个'`
      game_rule.value = res.data.rule
      formData.status = res.data.status
    }
  } catch (error) {
    console.error(error)
  } finally {
    isBettingDetailLoading.value = false
  }
}

const setRefer_content = (data: IGameTypePlayDetailsData) => {
  if (data.maxCount === 1) {
    return '至少选择「 一 」个'
  }
  return `最少选择「 ${chineseNumbers[data.minCount]}」个,至多选择「${chineseNumbers[data.maxCount]}」个`
}

onMounted(() => {
  if (bettingStore.gameListTypeCode.length === 0) {
    bettingStore.getListPlayTypeCode()
  }
})
</script>

<style lang="less" scoped>
.game_result_wrapper {
  border: 1px solid grey;
}
.game_list {
  padding-left: 0;
  padding-top: 10px;
  display: flex;
  list-style: none;
  flex-wrap: wrap;
  gap: 20px;
  > li {
    background-color: green;
    border-radius: 100%;
    height: 30px;
    width: 30px;
    display: inline-block;
    font-size: 18px;
    line-height: 30px;
    text-align: center;
    color: white;
  }
}
.container {
  display: flex;
  justify-content: space-between;
}
.left-column,
.right-column {
  width: 48%;
}
.details {
  margin-top: 20px;
}
.zodiac-options {
  display: flex;
  flex-direction: column;
}

.m-level-table-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.m-level-table-inside {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.rule_explain {
}
</style>
