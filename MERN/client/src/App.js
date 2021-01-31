import React from 'react';
import { useRoutes } from './routes';
import {BrowserRouter as Router} from 'react-router-dom';
import { useAuth } from './hooks/auth.hook';
import 'materialize-css';
import { AuthContext } from './context/AuthContext';

function App() {
  // token, login, logout, userId  - передаются через контекст всему приложению
  const { token, login, logout, userId } = useAuth();
  
  const isAuthentificated  = !!token; // флаг который говорит, зарегистрирован пользователь или нет !!приводит к значению Boolean
  const routes = useRoutes(isAuthentificated); // теперь если значение (true) то пользователь переходит в систему
  console.log("isAuthentificated",isAuthentificated)
  return (
    <AuthContext.Provider value={ 
      {
        token, 
        login, 
        logout, 
        userId, 
        isAuthentificated 
      }
    } >
      <Router>
        <div className="container">
          {routes}
        </div>
      </Router>
    </AuthContext.Provider>
  )
}

export default App;
