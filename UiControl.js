module.exports = {
    allView: null,
    appName: null,
    action: null,
    className: null,
    data: null,
    packageName: null,
    index: 0,
    launchTimeout: 5000,
    scanTimeout: 1000,
    tryReboot: 3,


    Launch: function () {
        app.launch(this.packageName);
        this.appName = app.getAppName(this.packageName);
        if (this.WaitForPackage()) {
            return true;
        } else {
            console.log("启动" + this.appName + "超时");
            while (this.packageName == currentPackage()) {
                back();
                sleep(250);
            }
            sleep(500);
            if (this.tryReboot-- > 0) {
                console.log("尝试重新启动" + this.appName);
                return this.Launch();
            } else {
                console.log("启动" + this.appName + "失败");
            }
        }
        return false;
    },


    LaunchApp: function () {
        app.launchApp(this.appName);
        this.packageName = app.getPackageName(this.appName);
        if (this.WaitForPackage()) {
            return true;
        } else {
            console.log("启动" + this.appName + "超时");
            while (this.packageName == currentPackage()) {
                back();
                sleep(250);
            }
            sleep(500);
            if (this.tryReboot-- > 0) {
                console.log("尝试重新启动" + this.appName);
                return this.LaunchApp();
            } else {
                console.log("启动" + this.appName + "失败");
            }
        }
        return false;
    },


    StartActivity: function () {
        app.startActivity(app.intent({
            action: this.action,
            className: this.className,
            data: this.data,
            packageName: this.packageName
        }));
        this.appName = app.getAppName(this.packageName);
        if (this.WaitForActivity()) {
            return true;
        } else {
            console.log("启动" + this.appName + "超时");
            while (this.packageName == currentPackage()) {
                back();
                sleep(250);
            }
            sleep(500);
            if (this.tryReboot-- > 0) {
                console.log("尝试重新启动" + this.appName);
                return this.StartActivity();
            } else {
                console.log("启动" + this.appName + "失败");
            }
        }
        return false;

    },


    WaitForActivity: function () {
        let overTime = new Date().getTime();
        while ((new Date().getTime() - overTime) <= this.launchTimeout) {
            if (currentActivity() == this.className) {
                return true;
            }
            sleep(25);
        }
        return false;
    },


    WaitForPackage: function () {
        let overTime = new Date().getTime();
        while ((new Date().getTime() - overTime) <= this.launchTimeout) {
            if (currentPackage() == this.packageName) {
                return true;
            }
            sleep(25);
        }
        return false;
    },


    FindByDesc: function (content) {
        let overTime = new Date().getTime();
        let reslut = null;
        while ((new Date().getTime() - overTime) <= this.scanTimeout) {
            reslut = packageName(this.packageName).descMatches(content).find();
            if (reslut.length > 0) {
                this.allView = reslut;
                return true;
            }
            sleep(25);
        }
        this.allView = null;
        return false;
    },


    FindById: function (content) {
        let overTime = new Date().getTime();
        let reslut = null;
        while ((new Date().getTime() - overTime) <= this.scanTimeout) {
            reslut = packageName(this.packageName).id(content).find();
            if (reslut.length > 0) {
                this.allView = reslut;
                return true;
            }
            sleep(25);
        }
        this.allView = null;
        return false;
    },


    FindByText: function (content) {
        let overTime = new Date().getTime();
        let reslut = null;
        while ((new Date().getTime() - overTime) <= this.scanTimeout) {
            reslut = packageName(this.packageName).textMatches(content).find();
            if (reslut.length > 0) {
                this.allView = reslut;
                return true;
            }
            sleep(25);
        }
        this.allView = null;
        return false;
    },


    Click: function () {
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
    },


    ClickPoint: function () {
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
    },


    ClickPointRandom: function () {
        if (this.allView != null) {
            if (this.allView.length > this.index) {
                let view = this.allView[this.index];
                let rect = view.bounds();
                let x = (rect.right - rect.left) / 3;
                let y = (rect.bottom - rect.top) / 3;
                if (click(rect.centerX() + random(-x, x), rect.centerY() + random(-y, y))) {
                    this.index = 0;
                    return true;
                }
            }
        }
        this.index = 0;
        return false;
    }

};