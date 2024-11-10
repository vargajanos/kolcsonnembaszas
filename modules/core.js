const express = require('express');
const router = express.Router();
const ejs = require('ejs');
const db = require('./database');
//main ami a login
router.get('/', (req, res) => {
    ejs.renderFile('./views/index.ejs', { session: req.session }, (err, html)=>{
        if (err){
            console.log(err);
            return
        }
        req.session.msg = '';
        res.send(html);
    });
});
//regisztáricóra
router.get('/reg', (req, res) => {
    ejs.renderFile('./views/registration.ejs', { session: req.session }, (err, html)=>{
        if (err){
            console.log(err);
            return
        }
        req.session.msg = '';
        res.send(html);
    });
});
//rentre visz
router.get('/rent', (req, res)=>{
    if (req.session.isLoggedIn){
        db.query(`SELECT * FROM items WHERE available = 1`, (err, results)=>{
            if (err){
                req.session.msg = 'Database error!';
                req.session.severity = 'danger';
                res.redirect('/');
                return
            }
    
                ejs.renderFile('./views/rent.ejs', { items: results, session: req.session }, (err, html) => {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    req.session.msg = '';
                    res.send(html);
                });
                return
        })
        return
    }
    res.redirect('/');
});
//statisztiákra visz
router.get('/stat', (req, res)=>{
    if (req.session.isLoggedIn){
        ejs.renderFile('./views/statistics.ejs', { session: req.session }, (err, html)=>{
            if (err){
                console.log(err);
                return
            }
            req.session.msg = '';
            res.send(html);
        });
        return
    }
    res.redirect('/');
});
//saját profilra
router.get('/me', (req, res)=>{
    if (req.session.isLoggedIn){
        ejs.renderFile('./views/user.ejs', { session: req.session }, (err, html)=>{
            if (err){
                console.log(err);
                return
            }
            req.session.msg = '';
            res.send(html);
        });
        return
    }
    res.redirect('/');
});
//admin oldalra
router.get('/admin', (req, res)=>{
    if (req.session.isLoggedIn){
        ejs.renderFile('./views/admin.ejs', { session: req.session }, (err, html)=>{
            if (err){
                console.log(err);
                return
            }
            req.session.msg = '';
            res.send(html);
        });
        return
    }
    res.redirect('/');
});

//logout
router.get('/logout', (req, res)=>{

    req.session.isLoggedIn = false;
    req.session.userID = null;
    req.session.userName = null;
    req.session.userEmail = null;
    req.session.userRole = null;
    req.session.msg = 'You are logged out!';
    req.session.severity = 'info';
    res.redirect('/');

});
module.exports = router;