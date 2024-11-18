const express =require('express')
const router = express.Router()
const {check, validationResult} = require('express-validator')
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const User = require('../../models/User');
const config = require('config')

//@route api/users
//@desc
//@access Public
router.post('/',[
    check('name','name is required')
        .not()
        .isEmpty(),
    check('email','please include email').isEmail(),
    check('password','password must be 6 or more characters').isLength({min:6})
],async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    const {name, email, password} = req.body;

    try {
        let user = await User.findOne({email})
        //User exist
        if (user) {
            return res.status(400).json({errors: [{msg: 'User already exist'}]});
        }

        //not exist -> get gravatar,encrypt password
        const avatar = gravatar.url(email, {
            s: '200',
            r: 'pg',
            d: 'mm'
        })

        user = new User({
            name,
            email,
            avatar,
            password
        })

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password,salt);
        await user.save()

        //add jwt
        const payload = {
            user:{
                id: user.id
            }
        }

        jwt.sign(payload,
            config.get('jwtToken'),
            {expiresIn: 360000},
            (err,token) => {
                if (err) throw err;
                res.json({ token })
            });

    } catch (err) {
        res.status(500).send('Server error')
    }


})

module.exports = router;