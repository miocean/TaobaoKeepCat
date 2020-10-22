"ui";

__APPNAME__ = "自动养猫";
__RUNNING__ = false;

let thread = null;

ui.layout(
    <drawer>
        <vertical>
            <appbar>
                <toolbar id="toolbar" title="{{__APPNAME__}}" />
            </appbar>
            <Switch id="acs" text="无障碍服务" />
            <text />
            <text text="撸猫次数" textColor="#212121" textSize="16sp" />
            <input inputType="number" text="200" />
            <text />
            <button id="action" text="开始运行" style="Widget.AppCompat.Button.Colored" />
            <text />
            <button id="addguin" text="一梦黄梁" style="Widget.AppCompat.Button.Colored" />
        </vertical>
    </drawer>
);

//创建选项菜单(右上角)
ui.emitter.on("create_options_menu", menu => {
    menu.add("退出");
});

ui.emitter.on("options_item_selected", (e, item) => {
    switch (item.getTitle()) {
        case "退出":
            exit();
            break;
    }
    e.consumed = true;
});

activity.setSupportActionBar(ui.toolbar);


ui.emitter.on("resume", function () {
    ui.acs.checked = auto.service != null;
});

ui.acs.on("check", function (checked) {
    if (checked && auto.service == null) {
        app.startActivity({
            action: "android.settings.ACCESSIBILITY_SETTINGS"
        });
    }
    if (!checked && auto.service != null) {
        auto.service.disableSelf();
    }
});

ui.action.on("click", function () {
    if (auto.service == null) {
        toast("请开启无障碍服务");
        return;
    }
    if (__RUNNING__) {
        __RUNNING__ = false;
        threads.interrupt();
        ui.action.text("开始运行");
    } else {
        __RUNNING__ = true;
        ui.action.text("停止运行");
        thread = threads.start(function () {
            require("./Main.js");
        });
    }
});

ui.addguin.on("click", function () {
    app.startActivity({
        action: "android.intent.action.VIEW",
        data: "mqqapi://card/show_pslcard?card_type=group&uin=" + 538093804,
        packageName: "com.tencent.mobileqq"
    });
});