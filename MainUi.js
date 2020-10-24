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

            <card cardCornerRadius="2dp" height="64" margin="4" >
                <Switch id="Acss" text="无障碍服务" textSize="16sp" />
            </card>

            <card cardCornerRadius="2dp" height="64" margin="4">
                <Switch id="EntryKeepcat" text="自动进入养猫" textSize="16sp" checked="true" />
            </card>

            <card cardCornerRadius="2dp" height="64" margin="4">
                <linear gravity="center_vertical">
                    <text text="撸猫次数: " textColor="#999999" textSize="16sp" />
                    <input id="ClickCat" inputType="number"
                        text="200" textColor="#212121" textSize="16sp" w="*" />
                </linear>
            </card>

            <button id="Action" text="开始运行" style="Widget.AppCompat.Button.Colored" />
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


ui.emitter.on("load", function () {
    ui.Acss.checked = auto.service != null;
});

ui.emitter.on("resume", function () {
    ui.Acss.checked = auto.service != null;
});

ui.Acss.on("check", function (checked) {
    if (checked && auto.service == null) {
        app.startActivity({
            action: "android.settings.ACCESSIBILITY_SETTINGS"
        });
    }
    if (!checked && auto.service != null) {
        auto.service.disableSelf();
    }
});

ui.Action.on("click", function () {
    if (auto.service == null) {
        toast("请开启无障碍服务");
        return;
    }
    if (__RUNNING__) {
        __RUNNING__ = false;
        thread.interrupt();
        ui.Action.text("开始运行");
    } else {
        __RUNNING__ = true;
        ui.Action.text("停止运行");
        thread = threads.start(function () {
            require("./Main.js");
        });
    }
});

setInterval(() => {}, 1000);