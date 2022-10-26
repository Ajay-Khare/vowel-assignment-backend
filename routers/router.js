const express = require("express");
const router = express.Router();
router.use(express.json());
const user = require("../models/user")
const cors = require("cors");
const { hash } = require("bcrypt");
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const { validateToken } = require("../middleware/athentication")
const nodeMailer = require("nodemailer")
var jwt = require('jsonwebtoken');

router.use(cors())

router.get("/", (req, res) => {
    res.send("hello from router")
})

// api to register user
router.post("/register", body('email').isEmail(),
    body('password').isLength({ min: 6, max: 16 }),
    body("name").isLength({ min: 3 }),
    async (req, res) => {

        try {
            const errors = validationResult(req);
            const { name, password, email } = req.body;
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const data = await user.findOne({ email: email })
            if (!data) {
                bcrypt.hash(password, 10, async function (err, hash) {
                    if (err) {
                        return res.send(err.message)
                    }
                    const newUser = await user.create({
                        name: req.body.name,
                        email: req.body.email,
                        password: hash
                    })








                    // const id = newUser._id
                    // const sendMail = async (name, email, id) => {
                    //     try {
                    //         const transporter = await nodeMailer.createTransport({
                    //             host: "smtp.gmail.com",
                    //             port: 587,
                    //             secure: false,
                    //             requireTLS: true,
                    //             auth: {
                    //                 user: "ajay.khare2012@gmail.com",
                    //                 pass: "wmicmrkrsnjrfmqp",

                    //             }
                    //         })
                    //         const mailOption = {
                    //             from: "ajay.khare2012@gmail.com",
                    //             to: email,
                    //             subject: "verify its your gmail account",
                    //             html: `hii ${name}, please click here to <a href="http://localhost:3000/verify?id=${id}> Verify</a> your mail. </p>"`
                    //         }
                    //         transporter.sendMail(mailOption, function (err, info){
                    //             if (err) {
                    //                 console.log(err.message)
                    //             }
                    //             else {
                    //                 console.log("email has been sent", info.response)
                    //             }
                    //         })

                    //         sendMail(name, email, id);
                    //     } catch (error) {
                    //         console.log(error.message)
                    //     }
                    // }






                    res.status(200).json({ message: "Success" });
                });
            }
            else {
                res.send({ message: "user allready registerd" })
            }
        } catch (error) {
            console.log(error.message)
            res.send(error.message)
        }

    })

// api to login user
router.post("/login", body('email').isEmail(),
    body('password').isLength({ min: 4, max: 16 }),
    async (req, res) => {
        const { email, password } = req.body;

        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            let userObj = await user.findOne({ email })
            if (userObj) {
                let hash = userObj.password

                bcrypt.compare(password, hash, async function (err, result) {
                    if (err) {
                        res.status(400).send(err.message)
                    }
                    if (!result) {
                        res.status(400).json({ message: "Incorrect Password" })
                    }
                    if (result) {
                        token = jwt.sign({
                            exp: Math.floor(Date.now() / 1000) + (60 * 60),
                            data: userObj._id
                        }, 'secret');
                        res.status(200).json({ message: "Success", token })
                    }
                });
            }
            else {
                res.send({ message: "user not registered" })
            }
        } catch (error) {
            console.log(error.message)
            res.send(error.message)
        }
    })


// api for homepage
router.get("/homepage", validateToken, async (req, res) => {
    try {
        const data = await user.findOne({ _id: req.user })
        if (data) {
            res.send({ message: "success", data })
        }
        else {
            res.send({ message: "no data found" })
        }
    } catch (error) {
        res.send(error.message)
        console.log(error.message)

    }

})

router.get("verify?id",async (req, res) => {
    try {
        const id = req.query.id
        console.log(id)
        const data = await user.updateOne({ _id }, { $set: { verified: true } })
        res.send({message:'success'})
    } catch (error) {
        console.log(error.message)
    }
})


module.exports = router;