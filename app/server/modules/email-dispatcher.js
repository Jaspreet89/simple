var EM = {};
module.exports = EM;

EM.server = require("emailjs/email").server.connect(
    {
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        user: process.env.EMAIL_USER || 'info.simplewash@gmail.com',
        password: process.env.EMAIL_PASS || 'simplewash2016',
        ssl: true
    });

EM.dispatchResetPasswordLink = function (account, req, callback) {
    EM.server.send({
        from: process.env.EMAIL_FROM || 'Simple Wash <info.simplewash@gmail.com>',
        to: account.email,
        subject: 'Password Reset',
        text: 'something went wrong... :(',
        attachment: EM.composeEmail(account, req)
    }, callback);
}
EM.dispatchkontaktMessage = function (kontaktMessage, callback) {
    EM.server.send({
        from: process.env.EMAIL_FROM || 'Simple Wash <info.simplewash@gmail.com>',
        to: 'jaashy.singh@gmail.com',
        subject: 'Kontakt',
        text: '',
        attachment: EM.composekontaktEmail(kontaktMessage)
    }, callback);
}
EM.composekontaktEmail = function (kontaktMessage) {

    var html = "<html><body>";
    html += "Gender:- " + kontaktMessage.body.gender + ",<br><br>";
    html += "name:- " + kontaktMessage.body.name + ",<br><br>";
    html += "email:- " + kontaktMessage.body.email + ",<br><br>";
    html += "phone:- " + kontaktMessage.body.phone + ",<br><br>";
    html += "company:- " + kontaktMessage.body.company + ",<br><br>";
    html += "position:- " + kontaktMessage.body.position + ",<br><br>";
    html += "city:- " + kontaktMessage.body.city + ",<br><br>";
    html += "zip:- " + kontaktMessage.body.zip + ",<br><br>";
    html += "cars_count:- " + kontaktMessage.body.cars_count + ",<br><br>";
    html += "employees_count:- " + kontaktMessage.body.employees_count + ",<br><br>";
    html += "cleanings_count:- " + kontaktMessage.body.cleanings_count + ",<br><br>";
    html += "monthly:-" + kontaktMessage.body.monthly + ",<br><br>";
    html += "comment:-" + kontaktMessage.body.comment + ",<br><br>";
    html += "</body></html>";
    return [{data: html, alternative: true}];
}
EM.composeEmail = function (o, req) {
    var port = '/';
    /*if (process.env.PORT != undefined)
        port = ':' + process.env.PORT + '/';*/

    var link = req.protocol + '://' + req.host + port + 'reset-password?e=' + o.email + '&p=' + o.pass;
    var html = "<html><body>";
    html += "Hi " + o.name + ",<br><br>";
    html += "Your username is <b>" + o.user + "</b><br><br>";
    html += "<a href='" + link + "'>Click here to reset your password</a><br><br>";
    html += "Cheers,<br>";
    html += "<a href='#'>Simple Wash</a><br><br>";
    html += "</body></html>";
    return [{data: html, alternative: true}];
}
function getDateTime() {

    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    return day + "." + month + "." + year;

}
EM.createPDF=function(req,pdf,fs){
    var request = require('request');
     var myDoc = new pdf;
    myDoc.pipe(fs.createWriteStream(__dirname+'/pdf/simplewash.pdf'));
    myDoc.fontSize(10);
    request({url: 'http://washsimple.herokuapp.com/files/header.PNG', encoding: null}, function(error, response, body){
        if(!error && response.statusCode == 200){
            doc.image(body,{width:500});
        }
    });

    myDoc.moveDown(0.5);
    myDoc.text("Simple-Wash");
    myDoc.moveDown(0.1);
    myDoc.text("Reda Iddouch");
    myDoc.moveDown(0.1);
    myDoc.text("+49 (0)173 76 82 942");
    myDoc.moveDown(0.1);
    myDoc.text("Elsa-Brändström-Str. 51b");
    myDoc.moveDown(0.1);
    myDoc.text("Str. Nr. : 2726/075/64375");
    myDoc.moveDown(3);
    myDoc.text(req.body.vorname+ " "+req.body.nachname);
    myDoc.moveDown(0.1);
    myDoc.text(req.body.firma);
    myDoc.moveDown(0.1);
    myDoc.text(req.body.telefon);
    myDoc.moveDown(0.1);
    myDoc.text(req.body.email);
    myDoc.moveDown(0.1);
    myDoc.text(req.body.strasse+" "+req.body.hausnr);
    myDoc.moveDown(0.1);
    myDoc.text(req.body.einsatzort +" "+req.body.plz);
    myDoc.moveDown(2);
    myDoc.text("Rechnung");
    myDoc.text(getDateTime(),{align:'right'});
    myDoc.moveDown(2);
    myDoc.text("Marke: " + req.body.brand);
    myDoc.text("Modell: "+req.body.model);
    myDoc.text("Farbe: "+req.body.farbe);
    myDoc.text("Kennzeichen: "+req.body.kennzeichen);
    myDoc.text("Abstellplatz: "+req.body.abstellplatz);
    myDoc.text("Preis: "+req.body.preis);
    myDoc.text("Datum: "+req.body.datum);
    myDoc.text("Zeit: "+req.body.zeit);
    myDoc.text("Zahlungsart: "+req.body.zahlungsart);
    myDoc.text("Anmerkung: "+req.body.anmerkung);
    myDoc.moveDown(1);
    myDoc.text("Options: "+JSON.stringify(req.body.options));
    myDoc.moveDown(3);
    myDoc.text("Mit freundlichen Grüßen");
    myDoc.moveDown(0.1);
    myDoc.text("Simple-Wash");
    myDoc.moveDown(3);
    request({url: 'http://washsimple.herokuapp.com/files/footer.PNG', encoding: null}, function(error, response, body){
        if(!error && response.statusCode == 200){
            doc.image(body,{width:500});
        }
    });
	myDoc.end();
}
EM.dispatchMailWithAttachment = function (callback) {
    
    EM.server.send({
        from: process.env.EMAIL_FROM || 'Simple Wash <info.simplewash@gmail.com>',
        to: 'Simple Wash <info.simplewash@gmail.com>',
        subject: 'Reciept',
        text: 'Please Find Attachment',
        attachment:[{path:__dirname+"/files/simplewash.pdf", type:"application/pdf", name:"Rechnung.pdf"}]
    }, callback);
    
}