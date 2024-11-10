const express = require('express');
const router = express.Router();
const db = require('./database');
const moment = require('moment');
var CryptoJS = require("crypto-js");

//regisztráció
router.post('/reg', (req,res)=>{
    let {name, email, password, confirm} = req.body;

    if (!name || !email || !password || !confirm) {
        req.session.msg = 'Missing data!';
        req.session.severity = 'danger';
        res.redirect('/reg');
        return
    }

    if (password != confirm){
        req.session.msg = 'Passwords dont match!';
        req.session.severity = 'danger';
        res.redirect('/reg');
        return
    }

    let today = moment(new Date()).format('YYYY-MM-DD');
    db.query(`SELECT * FROM users WHERE email=?`, [email], (err, results)=>{
        if (err) {
            req.session.msg = 'This e-mail already registered!';
            req.session.severity = 'danger';
            res.redirect('/reg');
            return
        }


        db.query(`INSERT INTO users (name, email, password, membership_date,role) VALUES(?, ?, SHA1(?), ?, 'user')`, 
        [name, email, password, today], (err, results)=>{
        if (err){
            req.session.msg = 'Database error!';
            req.session.severity = 'danger';
            res.redirect('/reg');
            return
        }
        req.session.msg = 'User registered!';
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
        req.session.msg = 'Missing data!';
        req.session.severity = 'danger';
        res.redirect('/');
        return
    }

    db.query(`SELECT * FROM users WHERE email=? AND password=?`, [email, CryptoJS.SHA1(password).toString()], (err, results)=>{
        if (err){
            req.session.msg = 'Database error!';
            req.session.severity = 'danger';
            res.redirect('/');
            return
        }
        if (results == 0){
            req.session.msg = 'Invalid credentials!';
            req.session.severity = 'danger';
            res.redirect('/');  
            return
        }
        req.session.msg = 'You are logged in!';
        req.session.severity = 'info';

        req.session.isLoggedIn = true;
        req.session.userID = results[0].ID;
        req.session.userName = results[0].name;
        req.session.userEmail = results[0].email;
        req.session.userRole = results[0].role;

        console.log(req.session);
        res.redirect('/rent');
        return
    });
});


module.exports = router;