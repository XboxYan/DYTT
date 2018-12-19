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
const GetHomeData = ()=>fetchData(URI+'/GetHomeData');
const GetVideoInfo = (ID)=>fetchData(URI+`/GetVideoInfo?Id=${ID}`);
const GetSameVideo = (vName,ID)=>fetchData(URI+`/GetSameVideo?vName=${vName}&CurrentVideoId=${ID}`);
const GetDoubanInterests = ({DBID,start=0,count=5})=>fetchData(`https://frodo.douban.com/api/v2/movie/${DBID}/interests?start=${start}&count=${count}&status=done&order_by=latest&apikey=0b2bdeda43b5688921839c8ecb20399b`,{headers:{"User-Agent":"api-client/1 com.douban.movie"}});
const GetPageList = ({pageSize=30,pageIndex=1,Type,Channel='',Area='',Plot='',Year='',orderBy='updatetime'})=>fetchData(URI+`/GetPageList?pageSize=${pageSize}&pageIndex=${pageIndex}&Type=${Type}&Channel=${Channel}&Area=${Area}&Plot=${Plot}&Year=${Year}&orderBy=${orderBy}`);
const GetSearch = ({pageSize=30,pageIndex=1,SearchKey})=>fetchData(URI+`/GetPageList?SearchKey=${SearchKey}&pageSize=${pageSize}&pageIndex=${pageIndex}`);

export {fetchData,GetHomeData,GetVideoInfo,GetSameVideo,GetPageList,GetSearch,GetDoubanInterests}