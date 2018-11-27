const URI = 'http://api.skyrj.com/Api2/Dy';

export default (uri) => {
    return fetch(URI+uri)
        .then(d=>d.json())
        .then(d=>{
            return d
        })
        .catch(err=>{
            return err
        })
}