var request = require('request');

function postImage(fileImg) {
    url = "http://127.0.0.1:3050/image";
    //var fileImg = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==';
    var fileImg = 'iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==';


    var importFile = function(aux, fileImg) {
        var decodedFile = new Buffer(fileImg, 'base64');
        var r = request.post(url, function(err, httpResponse, body) {
            if (err) {
                console.log(err);
            }
            console.log(body);
            console.log(aux);
        });
        var form = r.form();
        form.append('file', decodedFile, {
            filename: 'temp.png'
        });

        return (r);
    }
    a = importFile("a",fileImg);
}
postImage("girada.png");
