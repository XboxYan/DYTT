# DYTT
电影天堂RN客户端

重新开始！

### 更新

#### 20181203

##### 主题颜色

`react-navigation`内置属性`screenProps`

```jsx
<App screenProps={{themeColor:themeColor, setTheme:this.setTheme}} />
```

调用方式

```js
const {navigation,screenProps:{themeColor}} = this.props;
```
#### 20181204

##### 历史记录

#### 20181205

##### 收藏页面

#### 20181206

##### 本地存储

使用原生`AsyncStorage`

#### 20181209

#### 搜索

### 已知问题

目前接口存在返回满的问题（其实是晚上），不过网站 [http://skydy.top/](http://skydy.top/)还正常，接下来可能进行本地爬虫处理