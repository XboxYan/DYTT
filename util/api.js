const URI = 'http://api.skyrj.com/Api2/Dy';

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

const GetHomeData = ()=>fetchData(URI+'/GetHomeData').then(d=>{
    return {
        solling:{
            name:'轮播图',
            list:d.filter(el=>el.listType==='solling')
        },
        movie:{
            name:'电影',
            list:d.filter(el=>el.listType==='movie')
        },
        tv:{
            name:'电视剧',
            list:d.filter(el=>el.listType==='tv')
        },
        comic:{
            name:'动漫',
            list:d.filter(el=>el.listType==='comic')
        },
        variety:{
            name:'娱乐',
            list:d.filter(el=>el.listType==='variety')
        },
    }
});

//影片详情
const GetVideoInfo = (ID)=>fetchData(URI+`/GetVideoInfo?Id=${ID}`);

//获取列表
const GetPageList = ({pageSize=30,pageIndex=1,Type,Channel='',Area='',Plot='',Year='',orderBy='updatetime'})=>fetchData(URI+`/GetPageList?pageSize=${pageSize}&pageIndex=${pageIndex+1}&type=${Type}&Channel=${Channel}&Area=${Area}&Plot=${Plot}&Year=${Year}&orderBy=${orderBy}`);

//GetSearch
const GetSearch = ({pageSize=10,pageIndex=1,SearchKey})=>fetchData(URI+`/GetPageList?SearchKey=${SearchKey}&pageSize=${pageSize}&pageIndex=${pageIndex}`).then((d)=>{
    return {
        list:d,
        isEnd:d.length<pageSize
    };
})

const GetSameVideo = (vName,ID)=>fetchData(URI+`/GetSameVideo?vName=${vName}&CurrentVideoId=${ID}`);

export {fetchData,GetHomeData,GetSameVideo,GetVideoInfo,GetPageList,GetSearch}