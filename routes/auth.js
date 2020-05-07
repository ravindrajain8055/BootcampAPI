const express = require("express");
const { register,
    login,
    getMe,
    forgetPassword,
    updateDetails,
    updatePassword,
    logout} = require('../controllers/auth')

const { protect } = require('../middleware/auth')

const router = express.Router();

router.route('/register').post(register)

router.route('/login').post(login)

router.route('/me').get(protect,getMe)
router.route('/updatedetails').post(protect,updateDetails)
router.route('/updatepassword').put(protect,updatePassword)

router.route('/logout').get(logout)
// router.route('/forgetpassword').post(forgetPassword)

// router.put('/resetPassword/:resettoken',resetPassword)

module.exports = router;
