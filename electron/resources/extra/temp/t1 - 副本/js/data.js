
// 地址查找链接 https://www.mca.gov.cn/mzsj/xzqh/2020/20201201.html
//jump2 是定位，jump1 没有定位  is_num 1 一排一个 2 一排多个  jumpChange 1优惠券变化 2不变化
//location.assign('./supermarket.html'); $pagedata
var page_data = {
  "page_name": "index.html",
  "page_title": "舌尖上的哈尔滨",
  "share_obj": {
    "share_title": "舌尖上的哈尔滨",
    "share_desc": "舌尖上的哈尔滨"
  },
  "activity_id": "shejianshangdehaerbin",
  "panle_type": "1",
  "img_list": [
    {
      "id": "ldA4JM",
      "title": "行1",
      "list": [
        {
          "id": "eVUW7M",
          "img_name": "H5_01.jpg",
          "jump_type": "0",
          "url": "",
          "tjparam": ""
        }
      ]
    },
    {
      "id": "4eO0w7",
      "title": "行2",
      "list": [
        {
          "id": "e5I6xQ",
          "img_name": "H5_02.jpg",
          "jump_type": "0",
          "url": "",
          "tjparam": ""
        }
      ]
    },
    {
      "id": "N08Ea3",
      "title": "行3",
      "list": [
        {
          "id": "IiJ5bF",
          "img_name": "H5_03.jpg",
          "jump_type": "0",
          "url": "",
          "tjparam": ""
        }
      ]
    },
    {
      "id": "Kvq5A7",
      "title": "行4",
      "list": [
        {
          "id": "3ZgZ2I",
          "img_name": "H5_04.jpg",
          "jump_type": "0",
          "url": "",
          "tjparam": ""
        }
      ]
    },
    {
      "id": "QCNPzY",
      "title": "行5",
      "list": [
        {
          "id": "bxEo2f",
          "img_name": "H5_05.jpg",
          "jump_type": "0",
          "url": "",
          "tjparam": ""
        }
      ]
    },
    {
      "id": "5jPQB2",
      "title": "行6",
      "list": [
        {
          "id": "8dTlkB",
          "img_name": "H5_06.jpg",
          "jump_type": "0",
          "url": "",
          "tjparam": ""
        }
      ]
    },
    {
      "id": "oPgTcX",
      "title": "行7",
      "list": [
        {
          "id": "BYZMoj",
          "img_name": "H5_07.jpg",
          "jump_type": "0",
          "url": "",
          "tjparam": ""
        }
      ]
    },
    {
      "id": "qinXae",
      "title": "行8",
      "list": [
        {
          "id": "252dyI",
          "img_name": "H5_08.jpg",
          "jump_type": "0",
          "url": "",
          "tjparam": ""
        }
      ]
    },
    {
      "id": "o0ioZu",
      "title": "行9",
      "list": [
        {
          "id": "eegL3M",
          "img_name": "H5_09.jpg",
          "jump_type": "0",
          "url": "",
          "tjparam": ""
        }
      ]
    },
    {
      "id": "5IqMxq",
      "title": "行10",
      "list": [
        {
          "id": "XLNf5C",
          "img_name": "H5_10.jpg",
          "jump_type": "0",
          "url": "",
          "tjparam": ""
        }
      ]
    },
    {
      "id": "DdSdg8",
      "title": "行11",
      "list": [
        {
          "id": "OhCcok",
          "img_name": "H5_11.jpg",
          "jump_type": "0",
          "url": "",
          "tjparam": ""
        }
      ]
    }
  ],
  "rule_postion": {
    "w": "0.56rem",
    "h": "1.37rem",
    "top": "-10000rem"
  },
  "share_postion": {
    "w": "1.1rem",
    "h": "0.85rem",
    "top": "5.35rem"
  },
  "address_arry": [],
  "pop_desc": "",
  "upath": "C:\\Users\\xiong\\Downloads\\旅发大会，相约前进【佳木斯】 4.28"
}

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
            } else {
                if (item.jump_type == 1) {
                    //不定位跳
                    img_str += `<div class="P${itemc.img_name}" onclick=jump1('${itemc.url}')>`

                }
                if (item.jump_type == 2) {
                    //定位跳
                    img_str += `<div class="P${itemc.img_name}" onclick=jump2('${itemc.url}')>`
                }
                if (item.jump_type == 3) {
                    //内部跳
                    img_str += `<div class="P${itemc.img_name}" onclick=jump3('${itemc.url}')>`
                }
                if (itemc.jump_type == 0) {
                    img_str += `<div class="P${itemc.img_name}">`
                }
                img_str += ` <img class="${itemc.img_name}"   src="images/${itemc.img_name}" alt="">`
                img_str += `</div>`
            }
            img_str += `</div>`
        }
    }
    $(".noneBox").append(img_str)

    $(".sub-cont pre").append(page_data.pop_desc)

    $(".rulesBtn").css("width", page_data.rule_postion.w)
    $(".rulesBtn").css("height", page_data.rule_postion.h)
    $(".rulesBtn").css("top", page_data.rule_postion.top)

    $(".fixedShare").css("width", page_data.share_postion.w)
    $(".fixedShare").css("height", page_data.share_postion.h)
    $(".fixedShare").css("top", page_data.share_postion.top)

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
