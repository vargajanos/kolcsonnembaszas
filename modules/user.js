const express = require('express');
const router = express.Router();
const db = require('./database');
const moment = require('moment');
var CryptoJS = require("crypto-js");

//regisztráció
router.post('/reg', (req,res)=>{
    let {name, email, password, confirm} = req.body;

    if (!name || !email || !password || !confirm) {
        req.session.msg = 'Fehlende Daten!';
        req.session.severity = 'danger';
        res.redirect('/reg');
        return
    }

    if (password != confirm){
        req.session.msg = 'Passwörter stimmen nicht überein!';
        req.session.severity = 'danger';
        res.redirect('/reg');
        return
    }

    let today = moment(new Date()).format('YYYY-MM-DD');
    db.query(`SELECT * FROM users WHERE email=?`, [email], (err, results)=>{
        if (err) {
            req.session.msg = 'Diese E-Mail ist bereits registriert!';
            req.session.severity = 'danger';
            res.redirect('/reg');
            return
        }


        db.query(`INSERT INTO users (name, email, password, membership_date,role) VALUES(?, ?, SHA1(?), ?, 'user')`, 
        [name, email, password, today], (err, results)=>{
        if (err){
            req.session.msg = 'Datenbankfehler!';
            req.session.severity = 'danger';
            res.redirect('/reg');
            return
        }
        req.session.msg = 'Benutzer registriert!';
        req.session.severity = 'success';
        res.redirect('/');
        return
    })


    })

})

//login
router.post('/login', (req, res)=>{
    let { email, password } = req.body;

    if (!email || !password) {
        req.session.msg = 'Fehlende Daten!';
        req.session.severity = 'danger';
        res.redirect('/');
        return
    }

    db.query(`SELECT * FROM users WHERE email=? AND password=?`, [email, CryptoJS.SHA1(password).toString()], (err, results)=>{
        if (err){
            req.session.msg = 'Datenbankfehler!';
            req.session.severity = 'danger';
            res.redirect('/');
            return
        }
        if (results == 0){
            req.session.msg = 'Ungültige Anmeldeinformationen!';
            req.session.severity = 'danger';
            res.redirect('/');  
            return
        }
        req.session.msg = 'Sie sind angemeldet!';
        req.session.severity = 'info';

        req.session.isLoggedIn = true;
        req.session.userID = results[0].ID;
        req.session.userName = results[0].name;
        req.session.userEmail = results[0].email;
        req.session.userRole = results[0].role;

        res.redirect('/rent');
        return
    });
});

//user delete
router.post('/delete:id', (req,res)=>{
    db.query(`DELETE FROM users WHERE ID = ?`,[req.params.id], (err, results)=>{
        if (err){
            req.session.msg = 'Datenbankfehler!';
            req.session.severity = 'danger';
            res.redirect('/admin');
            return
        }
        req.session.msg = 'Benutzer gelöscht!';
        req.session.severity = 'success';
        res.redirect('/admin');
        return

    });

})

module.exports = router;