const express = require("express")
const router = express.Router()

const {createUser, getAllUsers} = require("../controller/user-controller")



router.post('/', createUser);      // POST /api/users
router.get('/', getAllUsers);

module.exports = router