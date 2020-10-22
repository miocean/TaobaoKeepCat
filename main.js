auto.waitFor();

const uc = require("UiControl.js");

var delay = 750;
var num = 0;
var timeout = 45 * 1000;
var overTime = null;

console.show();

events.on("exit", function () {
    console.log("运行完毕");
    console.log("共撸猫" + --num + "次");
    sleep(3000);
    console.hide();
});


uc.action = "VIEW";
uc.className = "com.taobao.browser.BrowserActivity";
uc.data = "https://pages.tmall.com/wow/a/act/tmall/tmc/28098/3334/wupr?wh_pid=main-216034";
uc.packageName = "com.taobao.taobao";

if (uc.packageName == currentPackage()) {
    console.log("运行请前关闭淘宝");
    while (uc.packageName == currentPackage()) {
        console.log("正在尝试关闭淘宝")
        back();
        sleep(delay);
    }
}

uc.StartActivity();

sleep(delay);

threads.start(function () {
    setInterval(() => {
        if (uc.packageName != currentPackage()) {
            exit();
        }
    }, 250);
});


uc.scanTimeout = 5000;
if (uc.FindByText("活动链接")) {
    uc.Click()
    console.log(uc.allView[uc.index].text());
    sleep(delay);
}

uc.scanTimeout = 3000;
if (uc.FindByText(/[0-9]+喵币点击领取/)) {
    uc.Click();
    console.log(uc.allView[uc.index].text());
    sleep(delay);
}

if (uc.FindByText(/赚喵币|领猫币/)) {
    uc.Click();
    console.log(uc.allView[uc.index].text());
    sleep(delay);
}

console.log("开始浏览任务");
sleep(delay);

num = 0;

let invited = uc.FindByText(/邀请好友一起撸猫\([0-4]\/5\)/);
let login = uc.FindByText(/登录淘宝特价版送红包\(0\/1\)/);

uc.scanTimeout = 1000;
while (num++ < 4) {
    if (uc.FindByText(/去浏览|去逛逛|去搜索|去完成/)) {
        let text = uc.allView[uc.index].text();
        if (text == "去完成") {
            if (invited && login) {
                if (uc.allView.length == 2) break;
                else uc.index = 1;
            }
            else if (invited) {
                if (uc.allView.length == 1) break;
                else uc.index = 1;
            }
            else if (login) {
                if (uc.allView.length == 1) break;
            }
        }
        console.log(uc.allView[uc.index].text());
        if (uc.Click()) {
            sleep(delay);
            overTime = new Date().getTime();
            while ((second = new Date().getTime() - overTime) <= timeout) {
                console.log(second / 1000);
                if (uc.FindByText(/.*完成.*/) || uc.FindByDesc(/.*完成.*/)) {
                    console.log("任务完成");
                    break;
                }
            }
            back();
            sleep(delay);
            if (uc.FindByText(/.*退出.*/)) {
                uc.Click();
                console.log(uc.allView[uc.index].text());
                sleep(delay);
            }
            num = 0;
        }
    } else break;
    sleep(delay);
}

console.log("浏览任务完成");
sleep(delay);

if (uc.FindByText("关闭")) {
    uc.Click();
    console.log(uc.allView[uc.index].text());
    sleep(delay);
}

console.log("开始喂猫");
sleep(delay);

num = 0;
while (num++ < 4) {
    if (uc.FindByText(/.*喂猫升级.*|.*知道了.*|.*选兴趣.*|.*收下.*|.*选好了.*|.*领取奖励.*|.*立即领取.*/)) {
        console.log(uc.allView[uc.index].text());
        uc.Click();
        num = 0;
        sleep(delay);
        continue;
    }
    if (uc.FindByText(/.*喵币不足.*|.*领取成就勋章.*/)) {
        break;
    }
}

if (uc.FindByText("关闭")) {
    uc.Click();
    console.log(uc.allView[uc.index].text());
    sleep(delay);
}

console.log("喂猫完成");
sleep(delay);

console.log("开始撸猫200次");
sleep(delay);

if (uc.FindByText(/.*点击撸猫.*/)) {
    for (num = 0; num < 201; num++) {
        uc.ClickPointRandom();
        console.log("撸猫" + num + "次");
        sleep(random(50, 250));
    }
}
exit();