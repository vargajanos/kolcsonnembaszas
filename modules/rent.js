const express = require('express');
const router = express.Router();
const db = require('./database');
const ejs = require('ejs');
const moment = require('moment');

//adminként item felvétel
router.post('/post', (req,res)=>{
    let {title, type} = req.body;

    if (!title || !type) {
        req.session.msg = 'Missing data!';
        req.session.severity = 'danger';
        res.redirect('/admin');
        return
    }

       db.query(`INSERT INTO items (title, type, available) VALUES(?, ?, 1)`, 
        [title, type], (err, results)=>{ 
        if (err){
            req.session.msg = 'Database error!';
            req.session.severity = 'danger';
            res.redirect('/admin');
            return
        }
        req.session.msg = 'Item added!';
        req.session.severity = 'success';
        res.redirect('/admin');
        return
    })
})

//összes item lekérdezése
router.get('/all', (req,res)=>{
    db.query(`SELECT * FROM items`, (err, results)=>{
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
    })
})

//item rent id alapján
router.post('/rent:id', (req,res)=>{

    db.query(`UPDATE items SET available = 0 WHERE ID = ?`, [req.params.id], (err, results)=>{
        if (err){
            req.session.msg = 'Database error!';
            req.session.severity = 'danger';
            res.redirect('/rent');
            return
        }

        let today = moment(new Date()).format('YYYY-MM-DD');
        db.query(`INSERT INTO rentals (user_id, item_id, rental_date) VALUES (?,?,?)`, [req.session.userID, req.params.id, today], (err, results)=>{
            if (err){
                req.session.msg = 'Database error!';
                req.session.severity = 'danger';
                res.redirect('/rent');
                return
            }
            req.session.msg = 'Rented item!';
            req.session.severity = 'success';
            res.redirect('/rent');
            return

        })


    })



})

/*
//összes aktiv item lekérdezése
router.get('/active', (req,res)=>{
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
    })
})
*/
module.exports = router;