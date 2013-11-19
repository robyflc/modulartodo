/* 
 * Helper function for getting length of Objects
 */

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};


/* 
 * Global object to track loaded modules and files
 * to avoid duplicated download
 */
var required = {
    'modules': [],
    'files': [],
    'stack': []
}

/* 
 * Modules loader
 */

function require(name){
    if (required.modules.indexOf(name) < 0){
        $.getJSON('./modules/'+name+'/package.json', function(data){
            var data_urls = data.reqDependencies;
            var len = Object.size(data_urls);
            var i = 0;
            for (el in data_urls){
                var url = data_urls[el];
                if (required.files.indexOf(url) < 0){
                    //Get proper file
                    $.get('./modules/'+name+'/'+data_urls[el])
                    .success(function(data) {
                        url = this.url;
                        var ext = url.split('.').pop();
                        switch(ext){
                            case 'php':
                            case 'html':
                            case 'tpl':
                                //this.appended
                                $(data).appendTo('body');
                                break;
                            case 'css':
                                $('<link/>')
                                .attr({
                                    'rel':'stylesheet',
                                    'href':url
                                }).appendTo('head');
                                break;
                        }
                        required.files.push(url);
                        //Check if all files are included
                        i += 1;
                        if (i == len) {
                            $("body").trigger(name+"ready");
                            console.log(name+" ready !");
                            required.modules.push(name);
                        }
                    });
                } else {
                    console.log('File '+url+' already loaded!');
                }//endif
            };
        });    
    } else {
        console.log('Module '+name+' already loaded!');
    }
}
