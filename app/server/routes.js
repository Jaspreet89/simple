var CT = require('./modules/country-list');
var AM = require('./modules/account-manager');
var EM = require('./modules/email-dispatcher');
var pdf = require('pdfkit');
var fs = require('fs');
module.exports = function (app) {
    app.get('/', function (req, res) {
        res.render('index', {udata: req.session.user});
    });

    app.get('/contact', function (req, res) {
        res.render('contact', {udata: req.session.user});
    });
    app.get('/book', function (req, res) {
        res.render('book', {udata: req.session.user});
    });
    app.get('/about', function (req, res) {
        res.render('about', {udata: req.session.user});
    });
    app.get('/impressum', function (req, res) {
        res.render('impressum', {udata: req.session.user});
    });
    app.post('/contact', function (req, res) {
        EM.dispatchkontaktMessage(req, function (e, m) {
            if (!e) {
                res.redirect('/');

            } else {
                for (k in e) console.log('ERROR : ', k, e[k]);
                res.status(400).send('unable to send message');
            }
        });
    });
    app.post('/book', function (req, res) {
        EM.createPDF(req, pdf, fs);
        EM.dispatchMailWithAttachment(function () {
            if (req.session.user != null) {
                AM.updateAccount({
                    id: req.session.user._id,
                    name: req.session.user.name,
                    email: req.session.user.email,
                    pass: 'DO_NOT_UPDATE_PASS',
                    country: req.session.user.country,
                    data: req.body
                }, function (e, o) {
                    if (e) {
                        res.status(400).send('error-updating-data');
                    } else {
                        req.session.user = o;
                        // update the user's login cookies if they exists //
                        /* if (req.cookies.user != undefined && req.cookies.pass != undefined) {
                         res.cookie('user', o.user, {maxAge: 24 * 60 * 60 * 1000});
                         res.cookie('pass', o.pass, {maxAge: 24 * 60 * 60 * 1000});
                         }*/
                        res.status(200).send('ok');
                    }
                });
            } else {
                res.status(200).send('ok');
            }
        });


    });

// main login page //
    app.get('/anmeldung', function (req, res) {
        // check if the user's credentials are saved in a cookie //

        res.render('login', {title: 'Signin/Signup', countries: CT});

    });

    app.post('/anmeldung', function (req, res) {
        AM.manualLogin(req.body['user'], req.body['pass'], function (e, o) {
            if (!o) {
                res.status(400).send(e);
            } else {
                req.session.user = o;

                res.status(200).send(o);
            }
        });
    });

// logged-in user homepage //

    app.get('/accountSetting', function (req, res) {
        if (req.session.user == null) {
            // if user is not logged-in redirect back to login page //
            res.redirect('/');
        } else {
            res.render('accountSetting', {
                title: 'Control Panel',
                countries: CT,
                udata: req.session.user
            });
        }
    });

    app.post('/accountSetting', function (req, res) {
        if (req.session.user == null) {
            res.redirect('/anmeldung');
        } else {
            AM.updateAccount({
                id: req.session.user._id,
                name: req.body['name'],
                email: req.body['email'],
                pass: req.body['pass'],
                country: req.body['country'],
                data: req.session.user.data
            }, function (e, o) {
                if (e) {
                    res.status(400).send('error-updating-account');
                } else {
                    req.session.user = o;

                    res.status(200).send('ok');
                }
            });
        }
    });

    app.post('/logout', function (req, res) {
        delete req.session;
        req.sessionStore.destroy(req.sessionID,function (e, o) {
                res.status(200).send('ok');
        });
    });

// creating new accounts //


    app.post('/signup', function (req, res) {
        AM.addNewAccount({
            name: req.body['name'],
            email: req.body['email'],
            user: req.body['user'],
            pass: req.body['pass'],
            country: req.body['country'],
            data: {}
        }, function (e) {
            if (e) {
                res.status(400).send(e);
            } else {
                res.status(200).send('ok');
            }
        });
    });

// password reset //

    app.post('/lost-password', function (req, res) {
        AM.getAccountByEmail(req.body['email'], function (o) {
            if (o) {
                EM.dispatchResetPasswordLink(o, req, function (e, m) {
                    // TODO add an ajax loader to give user feedback //
                    if (!e) {
                        res.status(200).send('ok');
                    } else {
                        for (k in e) console.log('ERROR : ', k, e[k]);
                        res.status(400).send('unable to dispatch password reset');
                    }
                });
            } else {
                res.status(400).send('email-not-found');
            }
        });
    });

    app.get('/reset-password', function (req, res) {
        var email = req.query["e"];
        var passH = req.query["p"];
        AM.validateResetLink(email, passH, function (e) {
            if (e != 'ok') {
                res.redirect('/anmeldung');
            } else {
                req.session.reset = {email: email, passHash: passH};
                res.render('reset', {title: 'Reset Password'});
            }
        })
    });

    app.post('/reset-password', function (req, res) {
        var nPass = req.body['pass'];
        var email = req.session.reset.email;
        req.session.destroy();
        AM.updatePassword(email, nPass, function (e, o) {
            if (o) {
                res.redirect('/anmeldung');
            } else {
                res.status(400).send('unable to update password');
            }
        })
    });
    app.post('/delete', function (req, res) {
        AM.deleteAccount(req.body.id, function (e, obj) {
            if (!e) {

                req.session.destroy(function (e) {
                    res.status(200).send('ok');
                });
            } else {
                res.status(400).send('record not found');
            }
        });
    });

   /* app.get('*', function (req, res) {
        res.render('404', {title: 'Page Not Found'});
    });*/

};
