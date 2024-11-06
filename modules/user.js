const express = require('express');
const router = express.Router();
const db = require('./database');
const moment = require('moment');

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

module.exports = router;