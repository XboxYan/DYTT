# 电影天堂React Native 客户端

## 祝大家新年愉快！

经过二十多天的奋战，电影天堂for React Native 客户端初步完成，最新的影片资源等你来体验！

## 声明：

本项目中所用的[api](https://github.com/XboxYan/DYTT/blob/master/apk/README.md)来自电影天堂UWP(作者邮箱：<hengshuixu@foxmail.com>;)通过Fiddle抓包工具所得， 项目中所有内容的一切权利属于电影天堂UWP，本项目所有内容及代码仅供私下学习参考，不得作为其他用途。

## 技术：

[React Native](http://facebook.github.io/react-native/)

[Material Design 设计](http://design.1sters.com/)

## 相关依赖

```json
{
  "name": "DYTT",
  "version": "0.0.1",
  "private": true,
  "scripts": {
    "start": "node node_modules/react-native/local-cli/cli.js start",
    "test": "jest"
  },
  "dependencies": {
    "mobx": "^3.0.2",
    "mobx-react": "^4.1.0",
    "react": "~15.4.0-rc.4",
    "react-native": "0.40.0",
    "react-native-media-kit": "0.0.14",
    "react-native-orientation": "^1.17.0",
    "react-native-splash-screen": "^1.0.9",
    "react-native-storage": "^0.1.4",
    "react-native-vector-icons": "^4.0.0"
  },
  "devDependencies": {
    "babel-jest": "18.0.0",
    "babel-plugin-transform-decorators-legacy": "^1.3.4",
    "babel-preset-react-native": "1.9.1",
    "babel-preset-react-native-stage-0": "^1.0.1",
    "jest": "18.1.0",
    "react-test-renderer": "~15.4.0-rc.4"
  },
  "jest": {
    "preset": "react-native"
  }
}

```
（由于部分第三方库经过本人修改，因而直接运行可能不成功，如有需要单独联系）

## 支持平台

android 4.1+

IOS 7.0+(计划)


## 下载

github: [项目地址](https://github.com/XboxYan/DYTT)

下载链接：[电影天堂](https://github.com/XboxYan/DYTT/blob/master/apk/android/app-release.apk?raw=true)

二维码：

![电影天堂](https://raw.githubusercontent.com/XboxYan/DYTT/master/apk/code.png)

（微信扫码可能不支持，建议用其他扫描工具或者直接用浏览器打开上面链接）

## 功能截图

#### 主页

![主页](https://raw.githubusercontent.com/XboxYan/DYTT/master/apk/S70125-135145.jpg)

#### 侧边栏

![侧边栏](https://raw.githubusercontent.com/XboxYan/DYTT/master/apk/S70125-135229.jpg)

#### 影片详情

![影片详情](https://raw.githubusercontent.com/XboxYan/DYTT/master/apk/S70125-135132.jpg)

#### 视频播放

![视频播放](https://raw.githubusercontent.com/XboxYan/DYTT/master/apk/S70125-135117.jpg)

#### 历史纪录

![历史纪录](https://raw.githubusercontent.com/XboxYan/DYTT/master/apk/S70125-135138.jpg)

#### 搜索

![搜索](https://raw.githubusercontent.com/XboxYan/DYTT/master/apk/S70125-135213.jpg)

#### 搜索结果

![搜索结果](https://raw.githubusercontent.com/XboxYan/DYTT/master/apk/S70125-135220.jpg)

#### 主题换肤

![主题颜色](https://raw.githubusercontent.com/XboxYan/DYTT/master/apk/S70125-135237.jpg)

## 反馈

与api接口相关的问题（如视频播放串有误、搜索仅支持电影名等）暂时无法解决，只能等api作者更新这些问题，其他功能上的问题均可与我联系（live邮箱<yanwenbin1991@live.com>）

## 2017计划

* 完善历史纪录功能（目前还不支持选择删除功能）

* 添加收藏

* 资源分类（影片详情中的分类页可跳转到分类）

* 一些设置（如仅wifi下播放，清空缓存等等）

* 以上均完成后考虑推出IOS版本

## 捐赠

如果体验觉得还不错的话,请往我的微信或支付宝客户端，扫描二维码，捐赠 X元，^_^，谢谢！

#### 微信

![微信](https://raw.githubusercontent.com/XboxYan/DYTT/master/apk/wechat.png)

#### 支付宝

![支付宝](https://raw.githubusercontent.com/XboxYan/DYTT/master/apk/zhifubao.png)