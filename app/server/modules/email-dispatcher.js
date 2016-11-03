var EM = {};
module.exports = EM;

EM.server = require("emailjs/email").server.connect(
    {
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        user: process.env.EMAIL_USER || 'user@gmail.com',
        password: process.env.EMAIL_PASS || 'pass',
        ssl: true
    });

EM.dispatchResetPasswordLink = function (account, req, callback) {
    EM.server.send({
        from: process.env.EMAIL_FROM || 'Simple Wash <simplewash@gmail.com>',
        to: account.email,
        subject: 'Password Reset',
        text: 'something went wrong... :(',
        attachment: EM.composeEmail(account, req)
    }, callback);
}
EM.dispatchkontaktMessage = function (kontaktMessage, callback) {
    EM.server.send({
        from: process.env.EMAIL_FROM || 'Simple Wash <simplewash@gmail.com>',
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
    if (process.env.PORT != undefined)
        port = ':' + process.env.PORT + '/';

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
EM.dispatchMailWithAttachment = function (callback) {
    setTimeout(function(){
    EM.server.send({
        from: process.env.EMAIL_FROM || 'Simple Wash <simplewash@gmail.com>',
        to: 'jaashy.singh@gmail.com',
        subject: 'Reciept',
        text: 'Please Find Attachment',
        attachment:[{path:"./simplewash.pdf", type:"application/pdf", name:"reciept.pdf"}]
    }, callback);
    }, 15000);
}