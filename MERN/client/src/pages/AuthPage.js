import React, {useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useHttp } from '../hooks/http.hook';
import {useMessage} from '../hooks/message.hook';
import './style/AuthPage.css'


export const AuthPage = () => {
    // Работа с хуками

    const auth = useContext(AuthContext)

    const { loading, error, request, clearError } = useHttp() // извлекаем из хука

    const [form, setForm] = useState({
        email: '', password: ''
    })

    const message = useMessage();

    useEffect(() => {
        message(error)
        clearError();
    }, [error, message, clearError]) 

    const changeHandler = event => {
        setForm({ ...form, [event.target.name]: event.target.value} );
    }

    const registerHandler = async() => { 
        try{
             // данные прилетают с сервера (1-это API, 2-метод, 3-данные которые хотим передать на сервер - mail & pass )
            const data = await request( "/api/auth/register", 'POST', {...form} );
            message(data.message);
        }catch(e) {
            console.log("TEST", e)
            // Обработка ошибок была завершена в useHttp
        }
    }

    const loginHandler = async() => { 
        try{
             // данные прилетают с сервера (1-это API, 2-метод, 3-данные которые хотим передать на сервер - mail & pass )
            const data = await request( "/api/auth/login", 'POST', {...form} );
            // message(data.message);
            auth.login(data.token, data.userId ); 
        }catch(e) {
            console.log("TEST", e)
            // Обработка ошибок была завершена в useHttp
        }
    }

    return (
        <div className="row">
            <div className="col s6 offset-s3">
                <h1>short link</h1>
                <div className="card white darken-4">
                    <div className="card-content white-text">
                        <span className="card-title">Авторизация</span>
                        <div className="input-field">
                            <input 
                                placeholder="Введите email"
                                id="email"
                                type="text"
                                name="email"
                                className="blue-input"
                                onChange={changeHandler}
                            /> 
                            <label htmlFor="email">Email</label>
                        </div>
                        <div className="input-field">
                            <input 
                                placeholder="Введите пароль"
                                id="password"
                                type="password"
                                name="password"
                                className="blue-input"
                                onChange={changeHandler}
                            />
                            <label htmlFor="password">Пароль</label> 
                        </div>
                   
                    </div>
                    <div className="card-action">
                        <button 
                            className="btn white green-text"
                            onClick={loginHandler}
                            disabled={loading} // блокируем кнопки после нажатия
                        >
                            Войти
                        </button>
                        <button 
                            className="btn green accent-7"
                            onClick={registerHandler}
                            disabled={loading} // блокируем кнопки после нажатия
                        >
                            Создать аккаунт
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}