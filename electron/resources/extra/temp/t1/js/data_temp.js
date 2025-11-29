
// 地址查找链接 https://www.mca.gov.cn/mzsj/xzqh/2020/20201201.html
//jump2 是定位，jump1 没有定位  is_num 1 一排一个 2 一排多个  jumpChange 1优惠券变化 2不变化
//location.assign('./supermarket.html'); $pagedata
var page_data = $__pagedata__

$(function () {
    document.title = page_data.page_title
    let img_str = ""
    for (var i = 0; i < page_data.img_list.length; i++) {
        let item = page_data.img_list[i];
        img_str += `<div class="P${item.img_name}" style="display: flex;">`
        for (var j = 0; j < item.list.length; j++) {
            let itemc = item.list[j]
            if (itemc.jumpChange == 1) {
                img_str += `<div class="P${itemc.img_name}" onclick=${getJumpUrl(itemc.urlList)}>`
                img_str += `</div>`
            } else {
                if (itemc.jump_type == 'jump1') {
                    //不定位跳
                    img_str += `<div class="P${itemc.img_name}" onclick=jump1('${itemc.url}')>`

                }
                if (itemc.jump_type == "jump2") {
                    //定位跳
                    img_str += `<div class="P${itemc.img_name}" onclick=jump2('${itemc.url}')>`
                }
                if (itemc.jump_type == "jump3") {
                    //内部跳
                    img_str += `<div class="P${itemc.img_name}" onclick=jump3('${itemc.url}')>`
                }
                if (itemc.jump_type == 0) {
                    img_str += `<div class="P${itemc.img_name}">`
                }
                img_str += ` <img class="${itemc.img_name}"   src="images/${itemc.img_name}" alt="">`
                img_str += `</div>`
            }
            
        }
        img_str += `</div>`
    }
    $(".noneBox").append(img_str)

    $(".sub-cont pre").append(page_data.pop_desc)

    $(".rulesBtn").css("width", page_data.rule_postion.w*2/100 + "rem")
    $(".rulesBtn").css("height", page_data.rule_postion.h*2/100 + "rem")
    $(".rulesBtn").css("top", page_data.rule_postion.y*2/100 + "rem")
    $(".rulesBtn").css("left", page_data.rule_postion.x*2/100 + "rem")

    $(".fixedShare").css("width", page_data.share_postion.w*2/100 + "rem")
    $(".fixedShare").css("height", page_data.share_postion.h*2/100 + "rem")
    $(".fixedShare").css("top", page_data.share_postion.y*2/100 + "rem")
    $(".fixedShare").css("left", page_data.share_postion.x*2/100 + "rem")

    // try {
    //     btj();
    //   } catch (error) {
    //     console.log("分享----111==", error)
    //   }

})

function getJumpUrl(list) {
    if (!list.length) return
    //根据当前时间获取地址
    let currTime = new Date().getTime();
    let url = ""
    for (var i = 0; i < list.length; i++) {
        let item = list[i];
        let startTime = new Date(item.startTime).getTime();
        let endTime = new Date(item.endTime).getTime();
        if (currTime > startTime && currTime <= endTime) {
            url = item.mjump_fun;
            break;
        } else {
            url = list[0].mjump_fun;
        }
    }
    return url;
}
