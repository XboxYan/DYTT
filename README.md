# DYTT

电影天堂RN客户端V2.0

重新开始！

## 重新开始

两年前发布了第一个版本。

现在，

大概不到一个月的工作之余，使用最新的`react-native`和全新的设计完成了V2.0

## 免责声明

本项目仅供学习交流使用，不得用于其他商业行为，数据来源于第三方网站，与本人无关

## 项目依赖

```json
{
  "name": "DYTT",
  "version": "2.0.0",
  "private": true,
  "scripts": {
    "start": "node node_modules/react-native/local-cli/cli.js start",
    "test": "jest"
  },
  "dependencies": {
    "react": "16.6.1",
    "react-native": "0.57.5",
    "react-native-gesture-handler": "^1.0.9",
    "react-native-scrollviewpager": "^1.0.3",
    "react-native-splash-screen": "^3.1.1",
    "react-native-swiper": "^1.5.14",
    "react-native-vector-icons": "^6.1.0",
    "react-native-video": "^4.0.1",
    "react-navigation": "^3.0.0"
  },
  "devDependencies": {
    "babel-jest": "23.6.0",
    "jest": "23.6.0",
    "metro-react-native-babel-preset": "0.49.2",
    "react-test-renderer": "16.6.1"
  },
  "jest": {
    "preset": "react-native"
  }
}
```

## 下载

github [项目地址](https://github.com/XboxYan/DYTT)

下载链接 

二维码

（微信扫码可能不支持，建议用其他扫描工具或者直接用浏览器打开上面链接）

## 为什么要重新开始呢

有很多小伙伴发邮件问我为什么之前的项目运行不起来。

其实这个是我自己的原因，之前做的时候没什么经验，很多时候就直接修改了第三方库，所以就运行不起来了

还有就是第三方`api`也做了很大的变动

`react-native`和其他第三方库都更新了许多，正好重新开始，把一些新特性都利用起来（比如`context`），这比单纯的看文章要有效的多

正常的app本来就是需要长期维护更新的，只不过由于是个人项目，很多时候完成一个阶段就会因为各种原因而被耽搁，精力有限实属无奈

## 相关截图

首页

![首页](./screenshot/1.png)

功能菜单

![功能菜单](./screenshot/2.png)

历史记录

![历史记录](./screenshot/3.png)

收藏

![收藏](./screenshot/4.png)

主题颜色

![主题颜色](./screenshot/5.png)

搜索

![搜索](./screenshot/6.png)

搜索结果

![搜索结果](./screenshot/7.png)

影片筛选

![影片筛选](./screenshot/8.png)

影片详情

![影片详情](./screenshot/9.png)

影片播放

![影片播放](./screenshot/10.png)

## 更新记录

### 20181123

使用`react-navigation`作为导航

`/App.js`

```js
const Drawer = createDrawerNavigator({
	Index: Index,
	History: History,
	Follow: Follow,
	Theme: Theme,
},DrawerNavigatorConfig);

const App = createAppContainer(createStackNavigator({
	Drawer: Drawer,
	Search: Search,
	MovieContent: MovieContent,
	MovieDetail: MovieDetail,
	Comment: Comment,
}, StackNavigatorConfig));
```

tab切换使用的是本人封装导航器`react-native-scrollviewpager`

[https://github.com/XboxYan/react-native-scrollviewpager](https://github.com/XboxYan/react-native-scrollviewpager)

有兴趣的可以给个star

使用方式比较简单

```shell
yarn add react-native-scrollviewpager
```

```js

import Scrollviewpager from 'react-native-scrollviewpager';

const tabBarOptions = (themeColor) => ({
    style:{
        paddingHorizontal:10,
        height:40,
        backgroundColor:'#fff'
    },
    labelStyle:{
        color:'#666'
    },
    activeTintColor:themeColor,
    indicatorStyle:{
        width:20,
        borderRadius:4,
        height:3,
        backgroundColor:themeColor,
        bottom:2
    }
})

//
<Scrollviewpager tabBarOptions={tabBarOptions(themeColor)} >
    <Text tablabel="首页">111</Text>
    <Text tablabel="电影">111</Text>
    <Text tablabel="动漫">111</Text>
</Scrollviewpager> 
//
```

### 20181125

使用`context`管理全局数据

`/util/store.js`

历史记录，收藏，~~主题（废弃，下面有其他方式实现）~~

```js
export const Store = createContext(initialStore);

<Store.Provider value={{
    ...initialStore
}}>
    {this.props.children}
</Store.Provider>
```

### 20181127

影视详情页面

`./src/page/MovieDetail.js`

头部滚动跟随效果使用`Animated.ScrollView`实现

```js
scrollTop = new Animated.Value(0);

//...
<Animated.ScrollView
    scrollEventThrottle={1}
    onScroll={Animated.event(
        [{ nativeEvent: { contentOffset: { y: this.scrollTop } } }],
        { useNativeDriver: true }
    )}
>
</Animated.ScrollView>
//...

```

视频播放器自定义外观

`./src/components/Video.js`

使用开源播放器`react-native-video`

[https://github.com/react-native-community/react-native-video](https://github.com/react-native-community/react-native-video)

这里有一个`bug`

`source={{uri:uri}}`，`uri`不能为空字符串，否则切换资源部生效

支持手势快进快退，自动隐藏播放栏

* 还未完成的功能

全屏切换



### 20181203

主题颜色

`./App.js`、`./src/page/Theme.js`

`react-navigation`内置属性`screenProps`

```jsx
<App screenProps={{themeColor:themeColor, setTheme:this.setTheme}} />
```

调用方式

```js
const {navigation,screenProps:{themeColor}} = this.props;
```
### 20181204

历史记录

`./src/page/History.js`

通过`context`传递数据，需设置`contextType`

```js
import { Store } from '../../util/store';
export default class History extends PureComponent {
    render() {
        const { historyList } = this.context;
        return (
            //...
        )
    }
}
History.contextType = Store;
```

### 20181205

收藏页面

`./src/page/Follow.js`

与'历史记录'基本一致

### 20181206

本地存储

使用原生`AsyncStorage`

```js
class Storage {
    /**
     * 获取
     */

    static get = async (key) => {
        try {
            const value = await AsyncStorage.getItem(key);
            if (value !== null) {
                // We have data!!
                return JSON.parse(value)
            } else {
                return false
            }
        } catch (error) {
            return false
        }
    }

    /**
     * 保存
     */
    static save = async (key, value) => {
        try {
            await AsyncStorage.setItem(key, JSON.stringify(value));
            return true
        } catch (error) {
            // Error saving data
            return false
        }
    }
}

export default Storage;
```

### 20181209

搜索

### 20181211

影片筛选

使用侧边导航栏，调用方式与原生`DrawerLayoutAndroid`一致

```js
import DrawerLayout from 'react-native-gesture-handler/DrawerLayout';
```

### 20181214

图标，启动图

使用开源库`react-native-splash-screen`

[https://github.com/crazycodeboy/react-native-splash-screen#readme](https://github.com/crazycodeboy/react-native-splash-screen#readme)

2.0 基本完成

## 已知问题

目前接口存在返回慢的问题（其实是晚上），不过网站 [http://skydy.top/](http://skydy.top/)还正常，接下来可能进行本地爬虫处理

## 还未完成的还接下来要做的

* 视频播放做全屏切换
* 没有适配`ios`，不过代码中没有使用安卓专有的库，理论上可以直接运行，有兴趣的小伙伴可以`fork`下来自己适配一下
* 会新增设置选项，进行网络设置，播放设置等（会参考其他视频软件的功能）
* 目前历史记录和收藏均保存在本地，意味着如果卸载app将导致数据丢失，如果可能的话，将来把数据保存在自己的服务器上
* 如果谁有更好的设计和更好的`api`可以参考一下~

## 打赏

如果体验觉得还不错的话，大佬们可以随意打赏，金额不限

微信

![微信](./screenshot/wechat.jpg)

支付宝

![微信](./screenshot/alipay.jpg)