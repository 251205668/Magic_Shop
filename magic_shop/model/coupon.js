import { Http } from "../utils/http";

class Coupon{
  constructor(){}
  static async CollectCoupon(id){
    const res = await Http.request({
      url:`/coupon/collect/${id}`,
      method:"POST"
    })
    return res
  }
  static async getMyAviableCoupons(){
    const res = await Http.request({
      url:'/coupon/myself/available/with_category'
    })
    return res.data
  }
}

export{
  Coupon
}
