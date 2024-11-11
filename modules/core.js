const express = require('express');
const router = express.Router();
const ejs = require('ejs');
const db = require('./database');
const moment = require("moment")
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
                req.session.msg = 'Datenbankfehler!';
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
        db.query(`SELECT rentals.ID as "ID", user_id, rental_date, return_date, item_id, items.title, items.type
            FROM rentals
            INNER JOIN items ON rentals.item_id = items.ID
            WHERE user_id = ?`, [req.session.userID], (err, results)=>{
            if (err){
                req.session.msg = 'Datenbankfehler!';
                req.session.severity = 'danger';
                res.redirect('/');
                return
            }

            results.forEach(item => {
               item.rental_date = moment(item.rental_date).format("YYYY-MM-DD")
               item.return_date = moment(item.return_date).format("YYYY-MM-DD")
            });

            ejs.renderFile('./views/user.ejs', { items: results, session: req.session }, (err, html) => {
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
//admin oldalra
router.get('/admin', (req, res)=>{
    if (req.session.isLoggedIn){
        db.query(`SELECT * FROM users`, (err, results)=>{
            
            if (err){
                req.session.msg = 'Datenbankfehler!';
                req.session.severity = 'danger';
                res.redirect('/');
                return
            }
            let users = results;
            db.query(`SELECT * FROM rentals_`,(err, results)=>{
                if (err){
                    req.session.msg = 'Datenbankfehler!';
                    req.session.severity = 'danger';
                    res.redirect('/');
                    return
                }
                let rents = results
                rents.forEach(item => {
                    item.RentalDate = moment(item.RentalDate).format("YYYY-MM-DD")
                    item.ReturnDate = moment(item.ReturnDate).format("YYYY-MM-DD")
                });

                db.query(`SELECT * FROM items`, (err, results)=>{
                    if (err){
                        req.session.msg = 'Datenbankfehler!';
                        req.session.severity = 'danger';
                        res.redirect('/');
                        return
                    }
                    let items = results

                    ejs.renderFile('./views/admin.ejs', { session: req.session, users:users, rentals: rents, items:items }, (err, html)=>{
                        if (err){
                            console.log(err);
                            return
                        }
                        req.session.msg = '';
                        res.send(html);
                    });
                    return
                })

                return;

            })
            return;
        })
        return;
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
    req.session.msg = 'Sie sind abgemeldet!';
    req.session.severity = 'info';
    res.redirect('/');

});


module.exports = router;