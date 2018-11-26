export default (uri) => {
    return fetch(uri)
        .then(d=>d.json())
        .then(d=>{
            return d
        })
        .catch(err=>{
            return err
        })
}