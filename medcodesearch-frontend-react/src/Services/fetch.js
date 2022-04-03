
async function Fetch(language, version, catalog, code){

    if(code === version) { // standartkategorie
        if (catalog === 'drg_chapters') {
            return await fetch('https://search.eonum.ch/'
                + language + '/mdcs/' + version + '/ALL?show_detail=1');
        } else {
            return await fetch('http://search.eonum.ch/'
                + language + '/' + catalog + '/' + version + '/' + version + '?show_detail=1')
                .then((res) => res.json())
                .then((json) => {
                    console.log(json);
                    return json;
                })
        }
    }
    else { // unterkategorie
        if (catalog === 'drg_chapters'){
            return await fetch( 'https://search.eonum.ch/' +
                language + '/' + catalog + '/' + version + '/' + code + '?show_detail=1')
        }
        else {
            return await fetch( 'https://search.eonum.ch/' +
                language + '/' + catalog + '/' + version + '/' + code + '?show_detail=1')
        }
    }
}

export default Fetch;
