# 电影天堂RN客户端 API接口抓包

## 进入播放详情

> http://api.skyrj.com/api/movies/电影ID

### 示例

> http://api.skyrj.com/api/movies/20154

### 返回XML

* 情况1.

*bofang.bati.cc资源m3u8*

```xml
<string xmlns="http://schemas.microsoft.com/2003/10/Serialization/">
{"MovieDownUrls":[],"MoviePlayUrls":[{"sourceType":{"ID":1,"Name":"m3u8","SortBy":1},"ID":23099,"Index":1,"Name":null,"PlayUrl":"http://bofang.bati.cc/rr/HongMaoLanTuHuoFengHuang_hd.m3u8"}],"ID":20195,"DBID":"4124917","Name":"虹猫蓝兔火凤凰","MovieTitle":null,"Cover":"https://img5.doubanio.com/view/movie_poster_cover/lpst/public/p1365114936.jpg","Tags":" 中国大陆 / 动画","Introduction":null,"ReleaseDate":"2010-02-05T00:00:00","Score":5.4,"Year":2010,"IsDisplay":true,"Type":"movie","UpdateTime":"2017-01-02T08:00:56.32"}
</string>
```

* 情况2.

*优酷资源mp4*

```xml
<string xmlns="http://schemas.microsoft.com/2003/10/Serialization/">
{"MovieDownUrls":[],"MoviePlayUrls":[{"sourceType":{"ID":8,"Name":"Youku","SortBy":5},"ID":22971,"Index":1,"Name":null,"PlayUrl":"CODM3NTczMg=="}],"ID":20154,"DBID":"4853410","Name":"裸体之夜：掠夺狂爱","MovieTitle":null,"Cover":"https://img3.doubanio.com/view/movie_poster_cover/lpst/public/p709405175.jpg","Tags":" 日本 / 剧情 / 惊悚 / 情色 / 犯罪","Introduction":null,"ReleaseDate":"2010-10-02T00:00:00","Score":4.9,"Year":2010,"IsDisplay":true,"Type":"movie","UpdateTime":"2016-12-21T16:41:08.09"}
</string>
```

> PlayUrl:"CODM3NTczMg=="


## 请求播放串

> http://api.skyrj.com/api/PlayYouku?vid=播放串

### 示例

> http://api.skyrj.com/api/PlayYouku?vid=COTQ5MjUyMA==

### 返回XML

```xml
<string xmlns="http://schemas.microsoft.com/2003/10/Serialization/">
http://k.youku.com/player/getFlvPath/sid/44834550183378776b910_00/st/mp4/fileid/03002001005857EC8006B12D9B7D2F0C552EF1-C0E1-4825-0850-2E782950A1E3?K=cfbbc640be40e172282c038f&hd=1&ts=7830&oip=1883930650&sid=44834550183378776b910&token=2791&did=bb82eaf7ef439af03a53ab82d6b02768&ev=1&ctype=87&ep=2C7sY%2BcHQFW1RHXTKjdZs7VdmYv3jIhNc5QgrLql1oRgFU4emqSB%2BLZlKuoZLrmQX4fSQ12916IVTAEwpnWUxjnvyRSh3FPrqo3UAHcFq5YtWYEchHawmYWSx7TVlLg2
</string>
```

* 情况3.

*Bilibili资源mp4*

```xml
<string xmlns="http://schemas.microsoft.com/2003/10/Serialization/">
{"MovieDownUrls":[],"MoviePlayUrls":[{"sourceType":{"ID":3,"Name":"Bilibili","SortBy":2},"ID":22920,"Index":1,"Name":null,"PlayUrl":"av7620304.html@page=1"},{"sourceType":{"ID":3,"Name":"Bilibili","SortBy":2},"ID":22921,"Index":2,"Name":null,"PlayUrl":"av7620304.html@page=2"},{"sourceType":{"ID":3,"Name":"Bilibili","SortBy":2},"ID":22922,"Index":3,"Name":null,"PlayUrl":"av7620304.html@page=3"},{"sourceType":{"ID":3,"Name":"Bilibili","SortBy":2},"ID":22923,"Index":4,"Name":null,"PlayUrl":"av7620304.html@page=4"},{"sourceType":{"ID":3,"Name":"Bilibili","SortBy":2},"ID":22924,"Index":5,"Name":null,"PlayUrl":"av7620304.html@page=5"},{"sourceType":{"ID":3,"Name":"Bilibili","SortBy":2},"ID":22925,"Index":6,"Name":null,"PlayUrl":"av7620304.html@page=6"},{"sourceType":{"ID":3,"Name":"Bilibili","SortBy":2},"ID":22926,"Index":7,"Name":null,"PlayUrl":"av7620304.html@page=7"},{"sourceType":{"ID":3,"Name":"Bilibili","SortBy":2},"ID":22927,"Index":8,"Name":null,"PlayUrl":"av7620304.html@page=8"},{"sourceType":{"ID":3,"Name":"Bilibili","SortBy":2},"ID":22928,"Index":9,"Name":null,"PlayUrl":"av7620304.html@page=9"}],"ID":20150,"DBID":"26410598","Name":"刑事7人 第一季","MovieTitle":null,"Cover":"https://img3.doubanio.com/view/movie_poster_cover/lpst/public/p2253550180.jpg","Tags":" 日本","Introduction":null,"ReleaseDate":"2015-07-15T00:00:00","Score":7.2,"Year":2015,"IsDisplay":true,"Type":"tv","UpdateTime":"2016-12-21T16:29:55.493"}
</string>
```

> PlayUrl:"av7620304.html@page=1"

## 请求播放串

> http://api.skyrj.com/api/PlayBilibili?vid=播放串

### 示例

> http://api.skyrj.com/api/PlayBilibili?vid=av7620304.html@page=1

### 返回XML

```xml
<string xmlns="http://schemas.microsoft.com/2003/10/Serialization/">
http://ws.acgvideo.com/a/1c/12481570-1.mp4?wsTime=1483987999&wsSecret2=69c8f570f7ec5d573d07c41fb8912e40&oi=2067327298&rate=140
</string>
```


## 获取电影列表

> http://api.skyrj.com/api/movies?pageSize=每页数目&pageIndex=当前页&orderBy=排序

### 示例

> http://api.skyrj.com/api/movies?pageSize=50&pageIndex=2&orderBy=**ID**//**UpdateTime(最新更新)**//**ReleaseDate（最新上映）**//**Score（最高评分）**
`` &type=tv(电视剧) ``

### 返回XML

```xml
<ArrayOfMovieViewModel xmlns:i="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://schemas.datacontract.org/2004/07/SkyDY.ViewModels">
<MovieViewModel>
<Cover>
https://img1.doubanio.com/view/movie_poster_cover/lpst/public/p2394353738.jpg
</Cover>
<DBID>25847558</DBID>
<ID>20201</ID>
<Introduction i:nil="true"/>
<MovieTitle i:nil="true"/>
<Name>邻家大贱谍</Name>
<ReleaseDate>2016-11-08T00:00:00</ReleaseDate>
<Score>6.2</Score>
<Tags>美国 / 剧情 / 喜剧 / 动作</Tags>
<Type>movie</Type>
<Year>2016</Year>
</MovieViewModel>
<MovieViewModel>
<Cover>
https://img1.doubanio.com/view/movie_poster_cover/lpst/public/p915815758.jpg
</Cover>
<DBID>3004244</DBID>
<ID>20200</ID>
<Introduction i:nil="true"/>
<MovieTitle i:nil="true"/>
<Name>破处之旅</Name>
<ReleaseDate>2008-10-17T00:00:00</ReleaseDate>
<Score>6.4</Score>
<Tags>美国 / 喜剧 / 爱情 / 冒险</Tags>
<Type>movie</Type>
<Year>2008</Year>
</MovieViewModel>
</ArrayOfMovieViewModel>
```

## 获取影片详情（豆瓣）

> https://api.douban.com/v2/movie/subject/电影ID

### 示例

> https://api.douban.com/v2/movie/subject/26577206

### 返回JSON

```json
{
  "rating": {
    "max": 10,
    "average": 5.7,
    "stars": "30",
    "min": 0
  },
  "reviews_count": 1,
  "wish_count": 279,
  "douban_site": "",
  "year": "2016",
  "images": {
    "small": "https://img1.doubanio.com/view/movie_poster_cover/ipst/public/p2323945719.jpg",
    "large": "https://img1.doubanio.com/view/movie_poster_cover/lpst/public/p2323945719.jpg",
    "medium": "https://img1.doubanio.com/view/movie_poster_cover/spst/public/p2323945719.jpg"
  },
  "alt": "https://movie.douban.com/subject/26577206/",
  "id": "26577206",
  "mobile_url": "https://movie.douban.com/subject/26577206/mobile",
  "title": "讨厌的女人",
  "do_count": null,
  "share_url": "https://m.douban.com/movie/subject/26577206",
  "seasons_count": null,
  "schedule_url": "",
  "episodes_count": null,
  "countries": [
    "日本"
  ],
  "genres": [
    "悬疑"
  ],
  "collect_count": 329,
  "casts": [
    {
      "alt": "https://movie.douban.com/celebrity/1316808/",
      "avatars": {
        "small": "https://img1.doubanio.com/img/celebrity/small/1447661743.47.jpg",
        "large": "https://img1.doubanio.com/img/celebrity/large/1447661743.47.jpg",
        "medium": "https://img1.doubanio.com/img/celebrity/medium/1447661743.47.jpg"
      },
      "name": "吉田羊",
      "id": "1316808"
    },
    {
      "alt": "https://movie.douban.com/celebrity/1000705/",
      "avatars": {
        "small": "https://img3.doubanio.com/img/celebrity/small/2583.jpg",
        "large": "https://img3.doubanio.com/img/celebrity/large/2583.jpg",
        "medium": "https://img3.doubanio.com/img/celebrity/medium/2583.jpg"
      },
      "name": "木村佳乃",
      "id": "1000705"
    },
    {
      "alt": "https://movie.douban.com/celebrity/1315957/",
      "avatars": {
        "small": "https://img1.doubanio.com/img/celebrity/small/34438.jpg",
        "large": "https://img1.doubanio.com/img/celebrity/large/34438.jpg",
        "medium": "https://img1.doubanio.com/img/celebrity/medium/34438.jpg"
      },
      "name": "古川雄大",
      "id": "1315957"
    },
    {
      "alt": "https://movie.douban.com/celebrity/1012463/",
      "avatars": {
        "small": "https://img3.doubanio.com/img/celebrity/small/8545.jpg",
        "large": "https://img3.doubanio.com/img/celebrity/large/8545.jpg",
        "medium": "https://img3.doubanio.com/img/celebrity/medium/8545.jpg"
      },
      "name": "袴田吉彦",
      "id": "1012463"
    }
  ],
  "current_season": null,
  "original_title": "嫌な女",
  "summary": "影片改编自同名畅销小说，讲述的是专门从男人身上骗钱的女人小谷夏子(木村佳乃饰)和生活作风非常严谨、要给夏子“善后”的女律师石田彻子(吉田羊)的故事。",
  "subtype": "movie",
  "directors": [
    {
      "alt": "https://movie.douban.com/celebrity/1028490/",
      "avatars": {
        "small": "https://img5.doubanio.com/img/celebrity/small/51756.jpg",
        "large": "https://img5.doubanio.com/img/celebrity/large/51756.jpg",
        "medium": "https://img5.doubanio.com/img/celebrity/medium/51756.jpg"
      },
      "name": "黑木瞳",
      "id": "1028490"
    }
  ],
  "comments_count": 136,
  "ratings_count": 279,
  "aka": [
    "Desperate Sunflowers the Movie"
  ]
}
```

## 影片分类

> http://api.skyrj.com/api/movies?pageSize=50&pageIndex=1&CategoryType=**类型**&CategoryArea=**地区**&Year=**年份**

### 示例

> http://api.skyrj.com/api/movies?pageSize=50&pageIndex=1&CategoryType=动画&CategoryArea=日本&Year=2016

### 返回XML

` 同影片列表 `

