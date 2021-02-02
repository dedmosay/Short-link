
```npm
npm i express mongoose
npm i -D nodemon concurrently
```
 
Для работы с общим конфиг
```npm
npm i config
``` 
создать папку config
и в ней создать файл default.json

Для шифрования паролей 
npm i bcryptjs

```js
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new User({ email, password: hashedPassword });
```

Для валидации данных при регистрации
npm i express-validator

```js
        const {check, validationResult} = require("express-validator");
```

Авторизация пользователя с помощью JWT token
npm i jsonwebtoken

Используем ключ с помощью json передаем
```json 
"jwtSecret": "ilin oleg"
```

создаем token 
```js
const token = jwt.sign(
        {userId: user.id },
        config.get("jwtSecret"),
        { expiresIn: "1h"}
) 

res.json({ token, userId: user.id })
```

## CLIENT 

Устанавливаем через npx

npx create-react-app client

Для одновременного запуска используем команду dev

```json
  "scripts": {
    "start": "node app.js",
    "server": "nodemon app.js",
    "client": "npm run start --prefix client",
    "dev": "concurrently \"npm run server\" \" npm run client\""
  }, 
```

Установим materialize 

https://materializecss.com/getting-started.html


Установим Prox для обменна данных между server:5000 и client:3000

Добавить в ./client новое поле
* package.json
```js
"proxy": "http://localhost:5000"
```

- Body не корректно передается на сервер, так как по умолчанию body воспринимается как stream

добавим несколько строк в app.js

```js
app.use(express.json( {extended: true}))        // теперь req.body является {}
```

теперь перед получением данных на client для метода GET создадим проверку 


```js
...
    const request = useCallback( async( url, method = 'GET', body = null, headers = {} ) => {
        
        setLoading(true) // Загрузка
        try {
            if(body) {
                body = JSON.stringify(body)
                headers['Content-type'] = 'application/json'
            }
...
```

Переменные окружения 
npm install --save-dev cross-env

https://www.npmjs.com/package/cross-env

```js
"build": "cross-env NODE_ENV=production webpack --config build/webpack.config.js"
```