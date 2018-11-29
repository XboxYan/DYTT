const URI = 'http://api.skyrj.com/Api2/Dy';

const fetchData = (uri) => {
    return fetch(URI+uri)
        .then(d=>d.json())
        .then(d=>{
            return d
        })
        .catch(err=>{
            return err
        })
}

const GetHomeData = ()=>fetchData('/GetHomeData');
const GetVideoInfo = (ID)=>fetchData(`/GetVideoInfo?Id=${ID}`);
const GetSameVideo = (vName,ID)=>fetchData(`/GetSameVideo?vName=${vName}&CurrentVideoId=${ID}`);

export {fetchData,GetHomeData,GetVideoInfo,GetSameVideo}