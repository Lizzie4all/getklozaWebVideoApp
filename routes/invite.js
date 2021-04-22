const express = require('express');
const router = express.Router();
const { v4: uuidV4 } = require('uuid')


router.get('/:invite', (req, res) => {
    res.render('invite', { roomId: req.params.invite })
  })

module.exports = router;