const express =require('express')
const router = express.Router()

//@route api/posts
//@desc
//@access Public
router.get('/', (req, res) => res.send('Posts route'))

module.exports = router;