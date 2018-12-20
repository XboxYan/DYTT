import cheerio from 'cheerio';

const URI = 'http://api.skyrj.com/Api2/Dy';
const WEB = 'http://skydy.top';

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

const GetHomeData = ()=>fetchData(URI+'/GetHomeData');

//影片详情
const GetVideoInfo = async (ID)=> {
    const html = await fetch(WEB+`/dy/pplay/${ID}`).then(d=>d.text());
    const $ = cheerio.load(html);
    const MoviePlayUrls = $('.playlistlink-1 li').map((i, el)=>{
        const s = $(el).children('a').attr('onclick');
        const {PlayUrl,Name} = getUrl(s);
        return ({
            "ID": 'play_'+i,
            "Index": i,
            "Name": Name,
            "PlayUrl": PlayUrl,
        })
    }).get();
    const RelateList = $('.swiper-wrapper .swiper-slide').map((i, el)=>{
        const videopic = $(el).find('.videopic');
        const score = videopic.children('.score');
        return ({
            "ID": getID(videopic.attr('href')),
            "Cover": videopic.data('original'),
            "Name": videopic.attr('title'),
            "MovieTitle": score.text(),
        })
    }).get();
    const movieInfo = $('.tab-content');
    const info = movieInfo.find('li');
    const data =  {
        "MoviePlayUrls":MoviePlayUrls,
        "ID": ID,
        "DBID": info.eq(3).children('a').text(),
        "Name": movieInfo.find('.note').text(),
        "MovieTitle": info.eq(4).text().replace('描述：',''),
        "Cover": getBg(movieInfo.find('.videopic').attr('style')),
        "Tags": info.eq(1).text().replace('类型：',''),
        "Introduction": movieInfo.find('.plot').text(),
        "ReleaseDate": info.eq(5).text().replace('发表时间：',''),
        "Score": movieInfo.find('.branch').text(),
        //"UpdateTime": "2018-09-25T10:58:25",
        "RelateList": RelateList,
    }
    return data;
}

const GetSameVideo = (vName,ID)=>fetchData(URI+`/GetSameVideo?vName=${vName}&CurrentVideoId=${ID}`);
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
            "MovieTitle": score.text(),
            "Cover": videopic.data('original'),
        })
    }).get()
    return data;
}

export {fetchData,GetHomeData,GetVideoInfo,GetSameVideo,GetPageList,GetDoubanInterests}