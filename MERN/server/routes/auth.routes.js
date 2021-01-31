const { Router } = require("express");
const router = Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const config = require("config");


// /api/auth/register
router.post(
    "/register",
    [
        check("email", "Некорректный email").isEmail(),
        check("password", "Минимальная длинна пароля 6 символов")
            .isLength({ min: 6 })
    ],
    async (req, res) => {   
        try {
            console.log('Body: ', req.body)
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                console.log("Не корректные данные при регистрации")
                return res.status(400).json({
                    errors: errors.array(),
                    message: "Не корректные данные при регистрации"
                    
                })
            }

            const { email, password } = req.body;

            const candidate = await User.findOne({ email });

            if (candidate) {
                console.log("Такой пользователь уже существует")
                return res.status(400).json({ message: "Такой пользователь уже существует" })
            }

            const hashedPassword = await bcrypt.hash(password, 12);
            const user = new User({ email, password: hashedPassword });

            await user.save()
            console.log("Пользователь создан")
            res.status(201).json({ message: "Пользователь создан" })
        } catch (e) {
            console.log( e, "Что-то пошло не так попробуйте снова ")
            res.status(500).json({ message: "Что-то пошло не так попробуйте снова " });
        }
    });

// /api/auth/login
router.post(
    "/login",
    [
        check('email', "Введите корректный email").normalizeEmail().isEmail(),
        check('password', "Введите пароль").isLength({min:6})
    ],
    async (req, res) => {
        try {
            console.log('Body: ', req.body)

            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                console.log("Не корректные данные при входе в систему")
                return res.status(400).json({
                    errors: errors.array(),
                    message: "Не корректные данные при входе в систему"
                })
            }

            const { email, password } = req.body;

            // <--------------------------------------------- ПРОВЕРКА ПОЛЬЗОВАТЕЛЯ
            const user = await User.findOne({ email });

            if (!user) {
                console.log("Пользователь не найден")
                return res.status(400).json({ message: "Пользователь не найден" })
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                console.log("Не верный пароль, введите снова")
                return res.status(400).json({ message: "Не верный пароль, введите снова" })
            }

            // <--------------------------------------------- АВТОРИЗАЦИЯ ПОЛЬЗОВАТЕЛЯ JWT token

            const token = jwt.sign(
                { userId: user.id },
                config.get("jwtSecret"),
                { expiresIn: "1h" }
            )

            res.json({ token, userId: user.id })
            // <--------------------------------------------- 47:57 СОЗДАНИЕ КЛИЕНТА

        } catch (e) {
            console.log("Что-то пошло не так, попробуйте снова ")
            res.status(500).json({ message: "Что-то пошло не так, попробуйте снова " });
        }
    });

module.exports = router;