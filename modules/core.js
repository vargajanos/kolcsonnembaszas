const express = require('express');
const router = express.Router();
const ejs = require('ejs');
const db = require('./database');

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


module.exports = router;