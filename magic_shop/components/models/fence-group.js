import { matrix } from './matrix'
import { Fence } from './fence'
class FenceGroup {
  // 抽离出一个矩阵
  spu
  skuList = []
  fences = []
  constructor(spu) {
    this.spu = spu
    this.skuList = spu.sku_list
  }
  // 获取matix对象
  _createMatrix() {
    const m = []
    this.skuList.forEach((item) => {
      m.push(item.specs)
    })
    return new matrix(m)
  }
  // // 遍历拿到所有的element 然后初始化fence
  // initFence() {
  //   const matrix = this._createMatrix(this.skuList)
  //   let CurrentJ = -1
  //   const fences = []
  //   matrix.forEach((element, i, j) => {
  //     // 首先判断当前列是否与currentJ相等
  //     if (CurrentJ !== j) {
  //       // 零列开始  然后将每列元素赋给fences 列变为行
  //       CurrentJ = j
  //       // 创建fence对象
  //       const fence = new Fence()
  //       fences[CurrentJ] = fence
  //     }
  //     // 将fence对象的title传入数组
  //     fences[CurrentJ].pushValuetitles(element.value)
  //   })
  //   console.log(fences);
  // }

  initFence() {
    const matrix = this._createMatrix(this.skuList)
    const fences = []
    // 拿到转置矩阵
    const AT = matrix.transpose()
    // 将矩阵的元素赋给对象属性
    AT.forEach((specs) => {
      const fence = new Fence(specs)
      // 实例化Cell对象 插入到Cells属性中
      fence.init()
      if (this._hasSktech_id() && this._IsSktech_id(fence.title_id)) {
        fence.setFenchSktech(this.skuList)
      }
      // 置于fences中
      fences.push(fence)
    })
    this.fences = fences
  }
  // 判断是否有sktech_id
  _hasSktech_id() {
    return this.spu.sketch_spec_id ? true : false
  }
  // 判断是否等于spu.id
  _IsSktech_id(fenceId) {
    return this.spu.sketch_spec_id === fenceId ? true : false
  }
  // 遍历所有的cell
  eachCell(cb) {
    for (let i = 0; i < this.fences.length; i++) {
      for (let j = 0; j < this.fences[i].Cells.length; j++) {
        const cell = this.fences[i].Cells[j]
        cb(cell, i, j)
      }
    }
  }
  // 拿到默认的sku
  getDefaultSku() {
    const defaultID = this.spu.default_sku_id
    const result = this.skuList.find((s) => {
      return s.id === defaultID
    })
    return result
  }
  // 传入cell,status就可以改变cell的状态为status
  setCellStatusById(cellId, status) {
    // 找到符合条件的cell
    this.eachCell((cell) => {
      if (cell.id === cellId) {
        cell.status = status
      }
    })
  }

  //* 通过skuCode 查找sku  注意要拼接一下spu的id
  getSkuBySkuCode(code) {
    const SkuCode = `${this.spu.id}$${code}`
    const sku = this.spu.sku_list.find((s) => {
      return s.code === SkuCode
    })
    return sku ? sku : null
  }
}
export { FenceGroup }
