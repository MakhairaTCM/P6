const express = require('express');
const router = express.Router();

// console.log("router init");

const saucesCtrl = require('../controllers/sauces');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');


router.post('/', multer, saucesCtrl.createSauces);
router.put('/:id', auth, multer, saucesCtrl.modifySauces);
router.delete('/:id', auth, saucesCtrl.deleteSauces);
router.get('/:id', auth, saucesCtrl.getOneSauces);
router.get('/', auth, saucesCtrl.getAllSauces);
router.post('/:id/like', auth, saucesCtrl.likeSauces);


module.exports = router;