import $axios from './index'

export function getPageTab1(params) {
  const url = '/getPageData1'
  return $axios.get(url, params)
}
export function getPageTab2(params) {
  console.log('传递参数', params)
  const url = '/getPageData2'
  return $axios.get(url)
}
