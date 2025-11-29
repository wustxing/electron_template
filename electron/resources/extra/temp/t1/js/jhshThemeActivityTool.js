let city_code = '';
let phoneNum = '';
let USER_ID = ''
let peakCutStepChangedTimestamp = ''
let START_TIME = ''
let SMART_MODE = ''
let isWhite = false;
let isVIP = false;


/**
 * 初始化判断是否在手机银行
 */
isInMBS();

// 获取削峰缓存
function getCouponPeakWhite() {
    let requestObj = {
        action: 'getCache',
        params: {
            key: 'couponPeakWhite'
        }
    }
    window.getCouponPeakWhiteCB = function (res) {
        console.log("couponPeakWhite", res);
        res = JSON.parse(res);
        isWhite = res.data.value == "1";
        console.log("削峰缓存 isWhite", isWhite);
    }
    window.CCBBridge && window.CCBBridge.requestNative(JSON.stringify(requestObj), 'getCouponPeakWhiteCB');
}
getCouponPeakWhite();
function getCouponPeakVIP() {
    let requestObj = {
        action: 'getCache',
        params: {
            key: 'couponPeakVIP'
        }
    }
    window.getCouponPeakVIPCB = function (res) {
        console.log("couponPeakVIP", res);
        res = JSON.parse(res);
        isVIP = res.data.value == "1";
        console.log("削峰缓存 isWhite", isVIP);
    }
    window.CCBBridge && window.CCBBridge.requestNative(JSON.stringify(requestObj), 'getCouponPeakVIPCB');
}
getCouponPeakVIP();

function getCityCacheCB(res) {
    res = JSON.parse(res)
    city_code = res.data.value;
    console.warn('city_code:', city_code)

}
window.getCityCacheCB = getCityCacheCB
function getCityCode() {
    let requestObj = {
        action: 'getCache',
        params: {
            key: 'cityCode',
        }
    }
    window.CCBBridge && window.CCBBridge.requestNative(JSON.stringify(requestObj), 'getCityCacheCB');
}
getCityCode();

// 流控档位重置
function resetLevel() {
    peakCutStepChangedTimestamp = 0
    window.jhshCouponConfig = {
        ...window.jhshCouponConfig,
        couponPeakCutLevel: 0
    }

    let params = encodeURI((JSON.stringify({
        peakCutStepChangedTimestamp: peakCutStepChangedTimestamp,
        couponPeakCutLevel: 0
    })))

    let requestObj = {
        action: 'setCache',
        params: {
            key: 'couponPeak',
            value: params,
        }
    }
    window.CCBBridge && window.CCBBridge.requestNative(JSON.stringify(requestObj), 'resetLevelCB');
}

//level start
function getLevelCB(res) {

    console.warn('getLevelCB0:', res)
    console.warn('getLevelCB1:', decodeURI(res))
    try {
        res = JSON.parse(decodeURI(JSON.parse(res).data.value))
        console.warn('getLevelCB2:', res)
    } catch (e) {
        console.error('parse', e)
    }
    // if(!peakCutStepChangedTimestamp || Number(peakCutStepChangedTimestamp)<Number(res.peakCutStepChangedTimestamp)){
    peakCutStepChangedTimestamp = Number(res.peakCutStepChangedTimestamp)
    let couponPeakCutLevel = Number(res.couponPeakCutLevel)
    window.jhshCouponConfig = {
        ...window.jhshCouponConfig,
        couponPeakCutLevel
    }
    console.warn('couponPeakCutLevel:', window.jhshCouponConfig)
    // }
}
window.getLevelCB = getLevelCB
function FlowThrottleInit(TIME, MODE = "") {
    START_TIME = TIME
    SMART_MODE = MODE
    console.warn()
    let requestObj = {
        action: 'getCache',
        params: {
            key: 'couponPeak',
        }
    }
    window.CCBBridge && window.CCBBridge.requestNative(JSON.stringify(requestObj), 'getLevelCB');
}

try {
    console.warn('init')
    FlowThrottleInit()
    const hidden = 'hidden' in document ? 'hidden'
        : 'webkitHidden' in document ? 'webkithidden'
            : 'mozHidden' in document ? 'mozhidden'
                : 'hidden';
    const visibilitychange = 'hidden' in document ? 'visibilitychange'
        : 'webkitHidden' in document ? 'webkitvisibilitychange'
            : 'mozHidden' in document ? 'mozvisibilitychange'
                : 'visibilitychange';

    document.addEventListener(visibilitychange, (e) => {
        if (!document[hidden])
            FlowThrottleInit();
    })
} catch (error) {
    console.error('FlowThrottleInit', e)
}

//level end

function myAlertinfo(text, fn, center = false, noBtn = false) {
    if (/\@\@|null/.test(text)) {
        text = text.replace(/\@\@|null/g, ' ')
    }

    vant.Dialog.confirm({
        message: text,
        messageAlign: center ? "center" : "left",
        confirmButtonText: "知道了",
        confirmButtonColor: "#FE6600",
        showConfirmButton: !noBtn,
        showCancelButton: false,
    }).then(
        () => {
            fn && fn();
        }
    ).catch(
        () => { }
    )
}

function showHint() {
    const delay = Math.random() * 1500 + 1000;
    // window.vm.$showLoading()
    window.CCBBridge && window.CCBBridge.ccbShowLoading()
    setTimeout(() => {
        window.CCBBridge && window.CCBBridge.ccbDismissLoading();//确保在展示对话框前关闭loading标志
    }, delay - 500)
    setTimeout(() => {
        // window.vm.$hideLoading()
        myAlertinfo('活动太火爆，加油哟')
    }, delay);
}

function parseStartTime(START_TIME) {
    const num2re = new RegExp(/[0-9]{2}/, 'g');
    const timeST = Array.from(START_TIME.matchAll(num2re), x => x[0])
    const Dnow = Date.now();
    let DayZ = Dnow - (Dnow + 8 * 3600 * 1000) % (1000 * 3600 * 24);
    let mt = 3600 * 1000;
    timeST.forEach(x => {
        DayZ += Number(x) * mt;
        mt /= 60;
    });
    return DayZ;
}
function FlowThrottle(START_TIME, SMART_MODE = "") {
    //未打开 => 返回
    if (Number(SMART_MODE) != 1) {
        return false;
    }
    //检查白名单
    console.warn('检查白名单')
    console.warn(window.jhshCouponConfig)
    // if (window.jhshCouponConfig.couponPeakPhoneList.includes(phoneNum) || window.jhshCouponConfig.couponPeakCityList.includes(city_code)) {
    if (isWhite) {
        console.warn('window.jhshCouponConfig.couponPeakCutConfig 1: ', window.jhshCouponConfig.couponPeakCutConfig);
        window.jhshCouponConfig.couponPeakCutConfig = {
            ...window.jhshCouponConfig.couponPeakCutConfig,
            couponLimit: 1,
            couponQueryLimit: 1
        }
        console.warn('window.jhshCouponConfig.couponPeakCutConfig 2: ', window.jhshCouponConfig.couponPeakCutConfig)
        console.warn('在白名单');
    }
    console.warn('不在白名单')
    if (!window.jhshCouponConfig.couponPeakCutConfig || Number(window.jhshCouponConfig.couponPeakCutConfig.couponQueryLimit) != 1) {
        return false;
    }
    console.warn('没有couponPeakCutConfig｜couponQueryLimit==0')

    // if (USER_ID && window.jhshCouponConfig.couponPeakVipList.includes(USER_ID)) {
    if (isVIP) {
        window.jhshCouponConfig.couponPeakCutConfig = {
            ...window.jhshCouponConfig.couponPeakCutConfig,
            couponLimit: 0,
            couponQueryLimit: 0,
        };
        console.warn('流控削峰VIP执行完');
        return false;
    }
    console.warn('FlowThrottle')
    try {
        const tflow = peakCutStepChangedTimestamp || 0;
        const t = parseStartTime(START_TIME);
        const stD = ((window.jhshCouponConfig.couponPeakCutConfig && window.jhshCouponConfig.couponPeakCutConfig.couponLimitTimePref) || 2) * 60 * 1000;
        const edD = ((window.jhshCouponConfig.couponPeakCutConfig && window.jhshCouponConfig.couponPeakCutConfig.couponLimitTimeSuffix) || 8) * 60 * 1000;
        const st = t - stD;
        const ed = t + edD;
        console.warn('削峰开始时间', String(new Date(st)))
        console.warn('削峰结束时间', String(new Date(ed)))
        console.warn('tflow:', String(new Date(tflow)))
        console.warn('活动时间t ', String(new Date(t)))
        console.warn('活动结束时间st', String(new Date(st)))
        console.warn('活动开始时间ed', String(new Date(ed)))

        if (tflow > ed || tflow < st) { //此时为上一次缓存未清除或已过高峰期
            resetLevel()
            console.warn('削峰：清除过时挡位缓存或已过高峰期缓存');
            return false;
        }

        if (Date.now() > ed || Date.now() < st) { //不在活动时间内 => 返回
            resetLevel()
            console.warn('削峰：不在活动时间区间内')
            return false;
        }
    } catch (error) {
        console.error('parseStartTime', error)
        return false;
    }

    //大于随机数 => 返回
    let rate = ((window.jhshCouponConfig.couponPeakCutConfig && window.jhshCouponConfig.couponPeakCutConfig.couponPeakCutRate) || 30);
    console.warn(rate)
    console.warn(window.jhshCouponConfig.couponPeakCutLevel)
    console.warn(typeof window.jhshCouponConfig.couponPeakCutLevel)
    if (window.jhshCouponConfig.couponPeakCutLevel && window.jhshCouponConfig.couponPeakCutLevel == 0) return console.warn('削峰：0档位')
    if (window.jhshCouponConfig.couponPeakCutLevel && window.jhshCouponConfig.couponPeakCutLevel == 2) rate = window.jhshCouponConfig.couponPeakCutConfig && window.jhshCouponConfig.couponPeakCutConfig.couponPeakCutRate2 || 50;
    console.warn(2, rate)
    if (window.jhshCouponConfig.couponPeakCutLevel && window.jhshCouponConfig.couponPeakCutLevel == 3) rate = window.jhshCouponConfig.couponPeakCutConfig && window.jhshCouponConfig.couponPeakCutConfig.couponPeakCutRate3 || 80;
    console.warn(3, rate)
    if (Math.random() * 100 > rate) {
        console.warn('削峰：幸运')
        return false;
    }

    console.warn('当前档位:', rate)
    //延时1s弹窗
    showHint();

    //符合削峰判断
    return true;
}

function getQueryVariable(url, name) {
    const reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    const resultLoca = window.location.search.substr(1).match(reg);
    const resultUrl = url.split('?').length > 1 ?
        url.split('?')[1].match(reg) :
        null;
    const valLoca = resultLoca ? decodeURI(resultLoca[2]) : null;
    const valUrl = resultUrl ? decodeURI(resultUrl[2]) : null;

    return valUrl || valLoca;
}

/**
* 判断是否在云商客户端
*/
function isInClient() {
    // return getClienVersion() ? true : false;
    var info = navigator.userAgent
    return (info.indexOf('CloudMercWebView') > -1) ? true : false
}

/**
* 判断是不是在手机银行App
*/
function isInMBS() {
    try {
        window["live_getMobileClientVersion"] = function (res) {
            console.log(res, '获取手机银行App版本号数据返回!!')
            window._isInMBS = res.version ? true : false
        }
        window.CCBBridge.getMobileClientVersion("", "live_getMobileClientVersion");
    } catch (e) {
        console.log(e)
    }
}

function forwardCB() { }
window.forwardCB = forwardCB

/**
 * 传入url，自动判断在端内还是端外。端内则继续跳转。端外则通过深度链接页面打开app指定页面
 * @param {String} url 目标页面地址
 */
function autoJumpLink(url) {
    if (!url) {
        return;
    }
    if (isInClient()) { //建行生活App端内
        //端外页面需要标题，端内链接不需要标题
        let isShowTitle = /CCBLIFE/.test(url) ? '0' : '1'
        window.CCBBridge && window.CCBBridge.requestNative(JSON.stringify({
            action: "forward",
            params: {
                type: '1',
                isNewView: '1',
                toPage: url, // 跳转链接
                isShowTitle: isShowTitle,
                isShowHeader: "0",
            }
        }), "forwardCB")
    } else if (window._isInMBS) {// 手机银行App端内
        if (/YS44000010000064/.test(url) || /YS44000098000512/.test(url)) {//文鱼电影打开微应用
            let params = {
                EXT_URL: encodeURIComponent('https://ccb.wenyu6.com/' + getQueryVariable(url, 'path')) || '',
            }
            let args = {
                funcid: '06040000',
                param: JSON.stringify(params)
            }

            //回调函数
            function callback(res) {
                //处理逻辑
                console.log(res, '回调')
            }
            //传入参数 、回调函数名
            console.log(args, '带参')
            try {
                CCBBridge.openfuncForlife(JSON.stringify(args), 'callback');
            } catch (e) {
                console.log(e)
            }
        } else { //手机银行App其他链接均拉起建行生活App打开当前链接
            outJumpLink(window.location.href)
        }
    } else {
        // 抖音/其他
        outJumpLink(url)
    }
}

/**
 * 传入url。端外通过深度链接页面打开app内指定url页面
 * @param {String} url 端内目标页面地址
 */
function outJumpLink(url) {
    if (/couponDetail/.test(url)) {//禁止deepLink到优惠券详情
        location.href = `https://yunbusiness.ccb.com/gbchannel/e_report/CloudLink/index.html?target=url&ccbParam=${encodeURIComponent(location.href)}`
    } else {
        location.href = `https://yunbusiness.ccb.com/gbchannel/e_report/CloudLink/index.html?target=url&ccbParam=${encodeURIComponent(url)}`
    }
}

/**
 * 分享
 * @param {String} title 分享标题
 * @param {String} text 分享的描述
 */
function doShare(title, text) {
    let requestObj = {
        action: 'share',
        params: {
            share_id: '',
            text: text,/*分享的描述*/
            title: title,/*标题*/
            url: window.location.href,/*链接*/
            image: 'https://res.yunbusiness.ccb.com/gbchannel/e_report/CCBLIFE/img/logo.45ebd170.png',
            type: ''/*预留*/,
        }
    };
    function shareCB() { }
    window.shareCB = shareCB
    window.CCBBridge && window.CCBBridge.requestNative(JSON.stringify(requestObj), 'shareCB');
};

/**
 * 获取用户定位信息
 * @param {function (data) {}} callback 定位回调匿名函数
 */
let hasCache = false;
function getPosition(callback) {
    getPositionCache(callback);
    let requestObj = {
        action: 'position',
        params: {
            needLocate: true,
            needCityLocation: false,
            cityName: '',
        },
    }
    function getUserPositionCB(res) {
        if (callback) {
            res = JSON.parse(res)
            if (res && res.data) {
                // setPositionCache(res);
                !hasCache && callback(res.data)
            } else {
                let obj = {}
                !hasCache && callback(obj)
            }
        }
    }
    window.getUserPositionCB = getUserPositionCB
    window.CCBBridge && window.CCBBridge.requestNative(JSON.stringify(requestObj), 'getUserPositionCB');
}

// 获取定位缓存
function getPositionCache(callback) {
    let requestObj = {
        action: 'getCache',
        params: {
            key: 'positionCache',
        }
    }
    window.getPositionCacheCB = function (res) {
        console.log("positionCache", res);
        res = JSON.parse(res);
        if (res.data.value) {
            hasCache = true;
            console.log("获取定位缓存成功! 直接返回缓存定位信息", JSON.parse(decodeURI(res.data.value)).data);
            callback && callback(JSON.parse(decodeURI(res.data.value)).data);
        }
    }
    window.CCBBridge && window.CCBBridge.requestNative(JSON.stringify(requestObj), 'getPositionCacheCB');
}

// 缓存定位
function setPositionCache(data) {
    console.log("设置定位缓存", data);
    let requestObj = {
        action: 'setCache',
        params: {
            key: 'positionCache',
            value: encodeURI(JSON.stringify(data))
        }
    }
    window.setPositionCacheCB = function () { };
    window.CCBBridge && window.CCBBridge.requestNative(JSON.stringify(requestObj), 'setPositionCacheCB');
}