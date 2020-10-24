// auto;
const uc = require("./UiControl.js");

events.on("exit", function () {
    print("运行结束")
});

// 延迟
let _delay = 750;
// 任务超时时间
let _taskTimeout = 30 * 1000;
let _overTime = null;
// 撸猫次数
let _clickCat = ui.ClickCat.text() || 200;

function print() {
    console.log(arguments);
    for (let i = 0; i < arguments.length; i++) {
        toast(arguments[i]);
    }
}

function getTime() {
    return new Date().getTime();
}

function ClickByDesc(content) {
    if (uc.FindByDesc(content)) {
        print(uc.allView[uc.index].text());
        uc.Click();
        sleep(_delay);
        return true;
    }
    return false;
}

function ClickByText(content) {
    if (uc.FindByText(content)) {
        print(uc.allView[uc.index].text());
        uc.Click();
        sleep(_delay);
        return true;
    }
    return false;
}

if (ui.EntryKeepcat.checked) {
    uc.action = "VIEW";
    uc.className = "com.taobao.browser.BrowserActivity";
    uc.data = "taobao://pages.tmall.com/wow/z/hdwk/act-20201111/assist-single?activityId=100074";
}
uc.packageName = "com.taobao.taobao";
uc.Launch();
sleep(_delay);

threads.start(function () {
    var onexit = setInterval(() => {
        if (uc.packageName != currentPackage()) {
            if (ui.Action.text() == "停止运行") {
                ui.run(function () {
                    ui.Action.click();
                });
                // print("停止运行");
            }
        }
    }, 250);
});
sleep(_delay);



if (ui.EntryKeepcat.checked) {
    uc.scanTimeout = 5000;

    ClickByText("去喂养猫猫")

    uc.scanTimeout = 1000;
    sleep(_delay);
}

_overTime = getTime();
while (getTime() - _overTime <= 5000) {
    if (currentActivity() == "com.taobao.browser.BrowserActivity") {
        break;
    } else {
        console.log(currentActivity());
    }
    sleep(_delay);
}

text("赚喵币").findOne(5000);

ClickByText(/[0-9]+喵币点击领取/);
ClickByText(/赚喵币|领猫币/);
ClickByText(/签到/);



function BaseTask(task) {
    uc.scanTimeout = _delay;
    let index = 0;
    let endlen = 0;
    let w = device.width,
        h = device.height;
    let x = w * 0.75,
        y = h * 0.5;
    let maxX = w * 0.125,
        maxY = h * 0.25;
    let btn;
    if (task == "去完成") {
        let a = uc.FindByText(/邀请好友一起撸猫\([0-4]\/5\)/),
            b = uc.FindByText(/登录淘宝特价版送红包\(0\/1\)/),
            c = uc.FindByText(/参与组队领红包\(0\/1\)/);
        if (a) {
            index += 1;
            endlen += 1;
        }
        if (b) endlen += 1;
        if (c) {
            index += 1;
            endlen += 1;
        }
    }
    do {
        let flag = false;
        if (uc.FindByText(task)) {
            btn = uc.allView;
            uc.index = index;
            if (uc.Click()) {
                if (btn.allView.length <= endlen) break;
                // print(uc.allView[index].text());
                sleep(_delay);
                _overTime = getTime();
                while ((time = getTime() - _overTime) <= _taskTimeout) {
                    swipe(x + random(-maxX, maxX), y + random(0, maxY),
                        x + random(-maxX, maxX), y + random(-maxY, 0), random(250, 750));
                    if (!uc.FindByText(/浏览[0-9]+秒/) && !uc.FindByDesc(/浏览[0-9]+秒/) && flag) {
                        print("任务完成");
                        break;
                    } else if (uc.FindByText(/浏览[0-9]+秒/) || uc.FindByDesc(/浏览[0-9]+秒/)) {
                        console.log(uc.allView[0].text() || uc.allView[0].desc());
                        flag = true;
                        sleep(_delay);
                    }
                    print(task + ": 持续" + time / 1000 + "秒");
                }
                back();
                sleep(_delay);
                ClickByText(/.*退出.*/);
            }
        }
        sleep(_delay);
    } while (btn != null && btn.length > endlen)
    print("[ " + task + " ]: 完成");
}

BaseTask("去浏览");
BaseTask("去逛逛");
BaseTask("去搜索");
BaseTask("逛一逛");
BaseTask("去完成");
sleep(_delay);

while (ClickByText("领取奖励") || ClickByDesc("领取奖励")) { sleep(_delay); }

exit();