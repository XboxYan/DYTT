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
    updateDialog: true,
    checkFrequency: CodePush.CheckFrequency.ON_APP_RESUME
};


class Dytt extends PureComponent {
    codePushStatusDidChange(status) {
        switch (status) {
            case codePush.SyncStatus.CHECKING_FOR_UPDATE:
                console.warn("Checking for updates.");
                break;
            case codePush.SyncStatus.DOWNLOADING_PACKAGE:
                console.warn("Downloading package.");
                break;
            case codePush.SyncStatus.INSTALLING_UPDATE:
                console.warn("Installing update.");
                break;
            case codePush.SyncStatus.UP_TO_DATE:
                console.warn("Installing update.");
                break;
            case codePush.SyncStatus.UPDATE_INSTALLED:
                console.warn("Update installed.");
                break;
        }
    }
    codePushDownloadDidProgress(progress) {
        console.warn(progress.receivedBytes + " of " + progress.totalBytes + " received.");
    }

    //如果有更新的提示
    syncImmediate = () => {
        CodePush.sync({
            updateDialog: {
                updateDialog: true,
                appendReleaseDescription: true,
                descriptionPrefix: '\n\n更新内容：\n',
                title: '更新',
                mandatoryUpdateMessage: '',
                mandatoryContinueButtonLabel: '更新',
            },
            mandatoryInstallMode: CodePush.InstallMode.IMMEDIATE,
            deploymentKey: "Ec3vaG7cpA6emP7A6s8VynhGFkdx67842615-88ee-487c-ab21-9908f18597db",
        }, (status) => {
            console.warn(status)
        });
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
