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
    checkFrequency: CodePush.CheckFrequency.MANUAL
};

AppRegistry.registerComponent(appName, () => CodePush(codePushOptions)(App));
