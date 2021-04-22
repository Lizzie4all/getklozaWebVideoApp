const express = require('express');
const router = express.Router();
const { v4: uuidV4 } = require('uuid')



router.get('/', (req, res) => {
    res.render('join');
});

router.post('/meet', (req, res) => {
    console.log(req.body.meetingId)
    res.redirect('/room?room='+req.body.meetingId);
});



module.exports = router;