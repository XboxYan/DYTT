/** @format */
import React, { PureComponent } from 'react';
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

import CodePush from "react-native-code-push";

const codePushOptions = {
    //设置检查更新的频率
    //ON_APP_RESUME APP恢复到前台的时候
    //ON_APP_START APP开启的时候
    //MANUAL 手动检查
    checkFrequency: CodePush.CheckFrequency.ON_APP_RESUME
};

const CODE_PUSH_PRODUCTION_KEY = 'iP5vE4FFzkilVLeIfVDZ5LwjUvdg67842615-88ee-487c-ab21-9908f18597db';

class Dytt extends PureComponent {

    codePushStatusDidChange = (status) => {
        switch (status) {
            case CodePush.SyncStatus.CHECKING_FOR_UPDATE:
                console.warn("Checking for updates.");
                break;
            case CodePush.SyncStatus.DOWNLOADING_PACKAGE:
                console.warn("Downloading package.");
                break;
            case CodePush.SyncStatus.INSTALLING_UPDATE:
                console.warn("Installing update.");
                break;
            case CodePush.SyncStatus.UP_TO_DATE:
                console.warn("Installing update.");
                break;
            case CodePush.SyncStatus.UPDATE_INSTALLED:
                console.warn("Update installed.");
                break;
            case CodePush.SyncStatus.UNKNOWN_ERROR:
                console.warn("An unknown error occurred");
                break;
        }
    }

    codePushDownloadDidProgress = (progress) => {
        console.warn(progress.receivedBytes + " of " + progress.totalBytes + " received.");
    }

    //如果有更新的提示
    syncImmediate = () => {
        // CodePush.checkForUpdate('iP5vE4FFzkilVLeIfVDZ5LwjUvdg67842615-88ee-487c-ab21-9908f18597db').then((update)=>{
        //     if (!update) {
        //         console.warn("The app is up to date!");
        //     } else {
        //         console.warn(update)
        //         console.warn("An update is available! Should we download it?");
        //     }
        
        // })
        CodePush.getCurrentPackage()
.then((update) => {
    // If the current app "session" represents the first time
    // this update has run, and it had a description provided
    // with it upon release, let's show it to the end user
    console.warn(update)
});
        CodePush.sync({
            updateDialog: {
                appendReleaseDescription: true,// 是否显示更新description
                descriptionPrefix: '\n更新内容：\n',//更新说明的前缀。 默认是” Description: 
                title: '更新',//要显示的更新通知的标题. Defaults to “Update available”.
                mandatoryUpdateMessage: '',//强制更新时，更新通知. Defaults to “An update is available that must be installed.”.
                mandatoryContinueButtonLabel: '继续',//强制更新的按钮文字. 默认 to “Continue”.
                optionalIgnoreButtonLabel:'忽略',
                optionalUpdateMessage:'',//非强制更新时，更新通知. Defaults to “An update is available. Would you like to install it?”.
                optionalInstallButtonLabel:'更新'
            },
            deploymentKey: CODE_PUSH_PRODUCTION_KEY,
            installMode: CodePush.InstallMode.ON_NEXT_RESTART,
        }, this.codePushStatusDidChange,this.codePushDownloadDidProgress);
    }

    componentWillMount() {
        CodePush.disallowRestart();//禁止重启
        this.syncImmediate(); //开始检查更新
    }

    componentDidMount() {
        CodePush.allowRestart();//在加载完了，允许重启
    }

    render() {
        return <App />
    }
}

// 这一行必须要写
Dytt = CodePush(codePushOptions)(Dytt)

AppRegistry.registerComponent(appName, () => Dytt);
