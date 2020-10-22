// auto;
const uc = require("./UiControl.js");

// 延迟
let _delay = 750;
// 任务超时时间
let _taskTimeout = 30 * 1000;
let _overtime = null;
// 撸猫次数
let _clickCat = 200;

function ClickByDesc(content) {
    if (uc.FindByDesc(content)) {
        console.log(uc.allView[uc.index].text());
        toast(uc.allView[uc.index].text());
        uc.Click();
        sleep(_delay);
    }
}

function ClickByText(content) {
    if (uc.FindByText(content)) {
        console.log(uc.allView[uc.index].text());
        toast(uc.allView[uc.index].text());
        uc.Click();
        sleep(_delay);
    }
}

events.on("exit", function () {
    console.log("运行完毕");
    toast("运行完毕");
    sleep(3000);
});

uc.action = "VIEW";
uc.className = "com.taobao.browser.BrowserActivity";
uc.data = "taobao://pages.tmall.com/wow/a/act/tmall/tmc/28098/3334/wupr?wh_pid=main-216034";
uc.packageName = "com.taobao.taobao";

if (uc.packageName == currentPackage()) {
    console.log("运行请前关闭淘宝");
    toast("运行请前关闭淘宝");
    _overtime = new Date().getTime();
    while (uc.packageName == currentPackage()) {
        if ((new Date().getTime() - _overtime) >= 5000) {
            console.log("尝试关闭淘宝超时");
            toast("尝试关闭淘宝超时");
            sleep(_delay);
            console.log("请你手动关闭淘宝");
            toast("请你手动关闭淘宝");
            sleep(_delay);
            console.log("关闭淘宝后请重新运行");
            toast("关闭淘宝后请重新运行");
            sleep(_delay);
            exit();
        }
        console.log("正在尝试关闭淘宝");
        back();
        sleep(25);
    }
    sleep(_delay);
}

uc.Launch();

// console.show();

sleep(_delay);

threads.start(function () {
    setInterval(() => {
        if (uc.packageName != currentPackage()) {
            exit();
        }
    }, 250);
});

uc.scanTimeout = 5000;
ClickByText("活动链接");

uc.scanTimeout = 1500;
ClickByText(/[0-9]+喵币点击领取/);
ClickByText(/赚喵币|领猫币/);

console.log("开始浏览任务");
toast("开始浏览任务");
sleep(_delay);

function BaseTask(content) {
    uc.scanTimeout = 1000;
    let index = 0;
    let endLength = 0;
    let x = device.width / 2 + device.width / 4;
    let y = device.height / 4;
    let mX = (device.width - x) / 4;
    let mY = (device.height - y) / 4;
    if (content == "去完成") {
        let a = uc.FindByText(/邀请好友一起撸猫\([0-4]\/5\)/);
        let b = uc.FindByText(/登录淘宝特价版送红包\(0\/1\)/);
        index = a ? 1 : 0;
        endLength = a && b ? 2 : a ? 1 : b ? 1 : 0;
    }
    do {
        if (uc.FindByText(content)) {
            if (uc.allView.length == endLength) break;
            uc.index = index;
            if (uc.Click()) {
                console.log(uc.allView[index].text());
                toast(uc.allView[index].text());
                sleep(_delay);
                _overtime = new Date().getTime();
                while ((time = new Date().getTime() - _overtime) <= _taskTimeout) {
                    swipe(x + random(-mX, mX), y + random(-mY, mY),
                        x + random(-mX, mX), y + random(-mY, mY), 500);
                    console.log(time / 1000 + "秒");
                    if (uc.FindByText(/.*完成.*/) || uc.FindByDesc(/.*完成.*/)) {
                        console.log("任务完成");
                        break;
                    }
                }
                back();
                sleep(_delay);
                ClickByText(/.*退出.*/);
            }
        }
    } while (uc.allView != null);
    console.log("[ " + content + " ]: 完成");
    toast("[ " + content + " ]: 完成");
    sleep(_delay);
}

BaseTask(/去浏览|去逛逛|去搜索/);
BaseTask("去完成");
sleep(_delay);

if (uc.FindByText(/.*领取奖励.*/)) {
    for (let i = 0; i < uc.allView.length; i++) {
        let view = uc.allView[i];
        uc.index = i;
        uc.Click();
        sleep(_delay);
    }
}

ClickByText("关闭");

console.log("开始喂猫");
toast("开始喂猫");
sleep(_delay);

_taskTimeout = 3 * 1000;
_overtime = new Date().getTime();
while ((new Date().getTime() - _overtime) <= _taskTimeout) {
    if (uc.FindByText(/.*喂猫升级.*|.*知道了.*|.*选兴趣.*|.*收下.*|.*选好了.*|.*领取奖励.*|.*立即领取.*/)) {
        console.log(uc.allView[uc.index].text());
        uc.Click();
        _overtime = new Date().getTime();
        sleep(_delay);
        continue;
    }
    if (uc.FindByText(/.*喵币不足.*|.*领取成就勋章.*/)) break;
}

ClickByText("关闭");
console.log("喂猫完成");
toast("喂猫完成");
sleep(_delay);

console.log("撸猫" + _clickCat + "次");
toast("撸猫" + _clickCat + "次");
sleep(_delay);

if (uc.FindByText(/.*点击撸猫.*/)) {
    let views = uc.allView;
    for (let i = 1; i <= _clickCat; i++) {
        uc.ClickPointRandom();
        console.log("撸猫" + i + "次");
        sleep(random(50, 100));
        if (i % 50 == 0) {
            ClickByText(/.*领取奖励.*|.*立即领取.*|.*宝箱.*/);
            ClickByText("关闭");
            uc.allView = views;
        }
    }
}
exit();