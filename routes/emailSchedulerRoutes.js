const express = require('express');
const router = express.Router();
const {
    create,read,list,update,remove,unSendList
} = require('../controllers/emailSchedulerController');
router.route('/create').post(create);
router.route('/read/:id').get(read);
router.route('/list').get(list);
router.route('/update/:id').put(update);
router.route('/remove/:id').delete(remove);
router.route('/unSendList').get(unSendList);
module.exports = router;