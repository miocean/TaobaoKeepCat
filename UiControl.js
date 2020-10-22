const result = {};

// region app
result.action = null;
result.appName = null;
result.className = null;
result.data = null;
result.packageName = null;
// endregion

result.allView = null;
result.index = 0;
result.launchTimeout = 5000;
result.scanTimeout = 1000;
result.tryReboot = 3;

result.Launch = function () {
    if (this.action != null || this.data != null) {
        app.startActivity(app.intent({
            action: this.action,
            className: this.className,
            data: this.data,
            packageName: this.packageName
        }));
        if (this.packageName == null) this.packageName = this.appName == null ? null : app.getPackageName(this.appName);
        if (this.appName == null) this.appName = this.packageName == null ? null : app.getAppName(this.packageName);
    } else if (this.packageName != null) {
        app.launch(this.packageName);
        this.appName = app.getAppName(this.packageName);
    } else if (this.appName != null) {
        app.launchApp(this.appName);
        this.packageName = app.getPackageName(this.appName);
    } else {
        return false;
    }

    threads.start(function () {
        if ((view = text("手机淘宝").findOne(3000)) != null) {
            sleep(1000);
            let rect = view.bounds();
            click(rect.centerX(), rect.centerY());
        }
    });

    if (this.FindByText(this.appName)) {
        this.ClickPoint();
    }

    if (!this.WaitForLaunch()) {
        console.log("启动" + this.appName + "超时");
        let overtime = new Date().getTime();
        while ((new Date().getTime() - overtime) <= this.launchTimeout) {
            if (this.className == currentActivity()) {
                back();
            } else if (this.packageName == currentPackage()) {
                back();
            } else break;
            sleep(25);
        }
        if (this.tryReboot-- > 0) {
            console.log("尝试重新启动" + this.appName);
            return this.Launch();
        }
    } else return true;
    return false;
}

result.WaitForLaunch = function () {
    let overtime = new Date().getTime();
    while ((new Date().getTime() - overtime) <= this.launchTimeout) {
        if (this.className == currentActivity()) {
            return true;
        } else if (this.packageName == currentPackage()) {
            return true;
        }
        sleep(25);
    }
    return false;
}

result.FindByDesx = function (content) {
    let overtime = new Date().getTime();
    while ((new Date().getTime() - overtime) <= this.scanTimeout) {
        this.allView = packageName(this.packageName).descMatches(content).find();
        if (this.allView.length > 0) {
            return true;
        }
        sleep(25);
    }
    this.allView = null;
    return false;
}

result.FindByText = function (content) {
    let overtime = new Date().getTime();
    while ((new Date().getTime() - overtime) <= this.scanTimeout) {
        this.allView = packageName(this.packageName).textMatches(content).find();
        if (this.allView.length > 0) {
            return true;
        }
        sleep(25);
    }
    this.allView = null;
    return false;
}

result.Click = function () {
    if (this.allView != null) {
        if (this.allView.length > this.index) {
            let view = this.allView[this.index];
            if (view.click()) {
                this.index = 0;
                return true;
            }
        }
    }
    this.index = 0;
    return false;
}

result.ClickPoint = function () {
    if (this.allView != null) {
        if (this.allView.length > this.index) {
            let view = this.allView[this.index];
            let rect = view.bounds();
            if (click(rect.centerX(), rect.centerY())) {
                this.index = 0;
                return true;
            }
        }
    }
    this.index = 0;
    return false;
}

result.ClickPointRandom = function () {
    if (this.allView != null) {
        if (this.allView.length > this.index) {
            let view = this.allView[this.index];
            let rect = view.bounds();
            let x = (rect.right - rect.left) / 4;
            let y = (rect.bottom - rect.top) / 4;
            if (click(rect.centerX() + random(-x, x), rect.centerY() + random(-y, y))) {
                this.index = 0;
                return true;
            }
        }
    }
    this.index = 0;
    return false;
}

module.exports = result;