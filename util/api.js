import cheerio from 'cheerio';

const WEBM = 'https://m.kankanwu.com';
const WEB = 'https://www.kankanwu.com';

const fetchData = (uri,par={}) => {
    return fetch(uri,par)
        .then(d=>d.json())
        .then(d=>{
            return d
        })
        .catch(err=>{
            return err
        })
}



const getHref = (s,m) => {
    if(s.includes('//')){
        return 'https:'+s;
    }else{
        return m+s;
    }
}

const GetHomeData = async () => {
    const html = await fetch(WEBM).then(d=>d.text());
    const $ = cheerio.load(html);
    const banner = $('.focusList>li').map((i,item)=>{
        return ({
            "ID": $(item).find('a').attr('href'),
            "Cover": getHref($(item).find('img').attr('src'),WEBM),
            "Name": $(item).find('.sTxt').text(),
        })
    }).get();


    const list = (index) => {
        const data = $('.all_tab>.list_tab_img').eq(index).find('li').map((i, item)=>{
            return ({
                "ID": $(item).find('a').attr('href'),
                "Cover": getHref($(item).find('img').attr('src'),WEBM),
                "Name": $(item).find('a').attr('title'),
                "MovieTitle": $(item).find('.title').text(),
                "Score": $(item).find('.score').text(),
            })
        }).get();
        return data;
    }
    const data =  {
        solling:{
            name:'轮播图',
            list:banner
        },
        movie:{
            name:'电影',
            list:list(0)
        },
        tv:{
            name:'电视剧',
            list:list(1)
        },
        comic:{
            name:'动漫',
            list:list(2)
        },
        variety:{
            name:'娱乐',
            list:list(3)
        },
    }
    return data;
};

//影片详情
const GetVideoInfo = async (ID)=> {
    const html = await fetch(WEB+`/${ID}`).then(d=>d.text());
    const $ = cheerio.load(html);
    const MoviePlayUrls = $('#detail-list .play-list').eq(0).children('a').map((i, el)=>{
        return ({
            "ID": 'play_'+i,
            "Index": i,
            "Name": $(el).text(),
            "PlayUrl": WEBM+$(el).attr('href'),
        })
    }).get();
    const RelateList = $('#con_latest_1 .img-list li').map((i, el)=>{
        return ({
            "ID": $(el).find('.play-img').attr('href'),
            "Cover": getHref($(el).find('img').attr('src'),WEB),
            "Name": $(el).find('h3').text(),
            "MovieTitle": $(el).find('.text').text(),
        })
    }).get();
    const getTags = (index) => info.eq(index).find('a').filter((i,el) => $(el).text().length>0).map((i,el) => $(el).text()).get().join(' ');
    const movieInfo = $('#detail-box');
    const info = movieInfo.find('.info dl');
    const Introduction = 
`主演：${getTags(0)}
导演：${getTags(5)}
简介：${$('#detail-intro').text()}`

    const data =  {
        "MoviePlayUrls":MoviePlayUrls,
        "ID": ID,
        "DBID": 0,
        "Name": movieInfo.find('h1').text(),
        "MovieTitle": info.eq(1).find('span').text(),
        "Cover": getHref(movieInfo.find('.detail-pic img').attr('src'),WEB),
        "Tags": getTags(2),
        "Introduction": Introduction,
        "ReleaseDate": info.eq(6).find('span').text(),
        "Score": 0,
        //"UpdateTime": "2018-09-25T10:58:25",
        "RelateList": RelateList,
    }
    return data;
}

const GetPlayUrl = async (url)=> {
    const u = url.replace('https://m','https://www');
    const html = await fetch(u).then(d=>d.text());
    const $ = cheerio.load(html);
    const playUrl = $('iframe').attr('src').split('=')[1];
    console.warn(playUrl)
    return playUrl;
}

const GetDoubanInterests = ({DBID,start=0,count=5})=>fetchData(`https://frodo.douban.com/api/v2/movie/${DBID}/interests?start=${start}&count=${count}&status=done&order_by=latest&apikey=0b2bdeda43b5688921839c8ecb20399b`,{headers:{"User-Agent":"api-client/1 com.douban.movie"}});

//获取列表
const GetPageList = async ({pageSize=25,pageIndex=1,Type='',Status='',Area='',Plot='',Year='',orderBy='hits'}) => {
    const mapType = {
        movie:1,
        tv:2,
        comic:3,
        variety:4,
    }
    //orderBy：'addtime' | 'hits' | 'gold'
    //https://www.kankanwu.com/index.php?s=Showlist-show-id-${Type}-mcid-${Plot}-lz-${Status}-area-${Area}-year-${Year}-letter--order-${orderBy}-picm-1-p-${pageIndex}.html
    //https://www.kankanwu.com/index.php?s=Showlist-show-id-4-mcid-16-lz-2-area-%E5%A4%A7%E9%99%86-year-2018-letter--order-addtime-picm-1-p-1.html
    //https://www.kankanwu.com/index.php?s=Showlist-show-id-3-mcid-59-lz-1-area-%E5%A4%A7%E9%99%86-year-2018-letter--order-hits-picm-1-p-2.html
    //https://www.kankanwu.com/index.php?s=Showlist-show-id-3-mcid-59-lz-2-area-%E5%A4%A7%E9%99%86-year-2018-letter--order-hits-picm-1-p-2.html
    //https://www.kankanwu.com/index.php?s=Showlist-show-id-1-mcid-8-lz--area-%E5%A4%A7%E9%99%86-year-2018-letter--order-addtime-picm-1-p-1.html
    //https://www.kankanwu.com/index.php?s=Showlist-show-id-2-mcid-133-lz-1-area-%E5%A4%A7%E9%99%86-year-2018-letter--order-addtime-picm-1-p-1.html
    //https://m.kankanwu.com/Animation/index_1_______1.html
    //https://m.kankanwu.com/Comedy/index_1_58_2_2018__hits_%E5%A4%A7%E9%99%86_1.html
    //https://m.kankanwu.com/Comedy/index_1_58_2_2018__hits_%E6%97%A5%E6%9C%AC_1.html
    //https://m.kankanwu.com/Comedy/index_1_58__2018__hits_%E5%A4%A7%E9%99%86_1.html
    //https://m.kankanwu.com/Comedy/index_1_28_2_2019__hits_%E5%A4%A7%E9%99%86_1.html
    //https://m.kankanwu.com/${Type}/index_${pageIndex}_${Plot}_${Status}_${Year}__${orderBy}_${Area}_1.html
    //https://m.kankanwu.com/${Type}/index_${pageIndex}_${Plot}__${Year}__${orderBy}_${Area}_1.html
    //const html = await fetch(WEBM+`/${Type}/index_${pageIndex}_${Plot}_${Status}_${Year}__${orderBy}_${Area}_1.html`).then(d=>d.text());
    const html = await fetch(WEB+`/index.php?s=Showlist-show-id-${mapType[Type]}-mcid-${Plot}-lz-${Status}-area-${Area}-year-${Year}-letter--order-${orderBy}-picm-1-p-${pageIndex}.html`).then(d=>d.text());
    const $ = cheerio.load(html);
    const data =  $('#contents li').map((i, el)=>{
        const video = $(el).find('a');
        return ({
            "ID": video.attr('href'),
            "Name": video.find('img').attr('alt'),
            "MovieTitle": $(el).find('.state').text(),
            "Cover": getHref(video.find('img').attr('src'),WEB),
        })
    }).get()
    return data;
}

//GetSearch
const GetSearch = async ({pageSize=25,pageIndex=1, SearchKey}) => {
    const html = await fetch(WEBM+`/vod-search-wd-${SearchKey}-p-${pageIndex}.html`).then(d=>d.text());
    const $ = cheerio.load(html);
    const getInfo = (info,i) => info.find('p').eq(i).find('a').map((i,el) => $(el).text()).get().join(' ');
    const data =  $('#resize_list li').map((i, el)=>{
        const video = $(el).find('a');
        const info = $(el).find('.list_info');
        return ({
            "ID": video.attr('href'),
            "Name": video.attr('title'),
            "Cover": getHref(video.find('img').attr('src'),WEB),
            "Info":{
                "Type":getInfo(info,1),
                "Art":getInfo(info,2),
                "Status":info.find('p').eq(3).text(),
                "Time":info.find('p').eq(4).text(),
            }
        })
    }).get()
    const isEnd = pageIndex>$('.ui-vpages span').text();
    return {
        list:data,
        isEnd:isEnd
    };
}

export {fetchData,GetHomeData,GetVideoInfo,GetPageList,GetDoubanInterests,GetPlayUrl,GetSearch}