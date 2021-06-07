const express = require('express');
const router = express.Router();

router.get('/forgetpass', function (req, res,) {
	res.render("forgetpass");
});



module.exports = router;