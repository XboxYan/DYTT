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

const getID = (s) => {
    return s.replace('javascript:toPlay(','').replace(')','');
}

const getUrl = (s) => {
    const reg  = /changeVideo\('([\s\S]*)','([\s\S]*)',/g;
    const [base,PlayUrl,Name] = reg.exec(s);
    return {PlayUrl,Name}
}

const getBg = (s) => {
    const reg = /url\(([\s\S]*)\)/g;
    const [base,Cover] = reg.exec(s);
    return Cover;
}

const GetHomeData = async () => {
    const html = await fetch(WEBM).then(d=>d.text());
    const $ = cheerio.load(html);
    const banner = $('.focusList>li').map((i,item)=>{
        return ({
            "ID": $(item).find('a').attr('href'),
            "Cover": WEBM+$(item).find('img').attr('src'),
            "Name": $(item).find('.sTxt').text(),
        })
    }).get();


    const list = (index) => {
        const data = $('.all_tab>.list_tab_img').eq(index).find('li').map((i, item)=>{
            return ({
                "ID": $(item).find('a').attr('href'),
                "Cover": 'http:'+$(item).find('img').attr('src'),
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
            "Cover": 'http:'+$(el).find('img').attr('src'),
            "Name": $(el).find('h3').text(),
            "MovieTitle": $(el).find('.text').text(),
        })
    }).get();
    const movieInfo = $('#detail-box');
    const info = movieInfo.find('.info dl');
    const Introduction = 
`${info.eq(0).text()}
${info.eq(5).text()}
${info.eq(2).text()}
简介：${$('#detail-intro').text()}`

    const data =  {
        "MoviePlayUrls":MoviePlayUrls,
        "ID": ID,
        "DBID": 0,
        "Name": movieInfo.find('h1').text(),
        "MovieTitle": info.eq(1).find('span').text(),
        "Cover": 'http:'+movieInfo.find('.detail-pic img').attr('src'),
        "Tags": info.eq(2).find('a').map((i,el) => ($(el).text()+' ')).get(),
        "Introduction": Introduction,
        "ReleaseDate": info.eq(6).find('span').text(),
        "Score": 0,
        //"UpdateTime": "2018-09-25T10:58:25",
        "RelateList": RelateList,
    }
    return data;
}

const GetPlayUrl = async (url)=> {
    const html = await fetch(url).then(d=>d.text());
    const $ = cheerio.load(html);
    const playUrl = $('iframe').attr('src').split('=')[1];
    return playUrl;
}

const GetDoubanInterests = ({DBID,start=0,count=5})=>fetchData(`https://frodo.douban.com/api/v2/movie/${DBID}/interests?start=${start}&count=${count}&status=done&order_by=latest&apikey=0b2bdeda43b5688921839c8ecb20399b`,{headers:{"User-Agent":"api-client/1 com.douban.movie"}});

//获取列表
const GetPageList = async ({pageSize=36,pageIndex=1,Type='',Channel='',Area='',Plot='',Year='',SearchKey='',orderBy='time'}) => {
    //orderBy：'time' | 'score' | 'new'
    const html = await fetch(WEB+`/dy/list?t=${Type}&c=${Channel}&y=${Year}&j=${Plot}&a=${Area}&s=${SearchKey}&b=${orderBy}&p=${pageIndex}`).then(d=>d.text());
    const $ = cheerio.load(html);
    const data =  $('.hy-video-list li').map((i, el)=>{
        const videopic = $(el).children('.videopic');
        const score = videopic.children('.score');
        return ({
            "ID": getID(videopic.attr('href')),
            "Name": videopic.attr('title'),
            "MovieTitle": score.text().replace(/(^\s*)(\s*$)/g, ''),
            "Cover": videopic.data('original'),
        })
    }).get()
    return data;
}

export {fetchData,GetHomeData,GetVideoInfo,GetPageList,GetDoubanInterests,GetPlayUrl}