import cn from '@/assets/json/country_cn.json'
import en from '@/assets/json/country_en.json'
import tw from '@/assets/json/country_tw.json'

const country = () => {
  let lang = localStorage.getItem('language')
  console.log(lang)
  if (lang == 'en') {
    return en
  } else if (lang == 'zh-cn') {
    return cn
  } else if (lang == 'zh-tw') {
    return tw
  } else {
    return cn
  }
}

export default country()
