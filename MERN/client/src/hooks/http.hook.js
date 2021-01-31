import {useState, useCallback} from 'react';


export const useHttp = () => {

    // loading - флаг для взаимодействия

    const [loading, setLoading] = useState (false);
    
    const [error, setError] = useState (null);

    const request = useCallback( async( url, method = 'GET', body = null, headers = {} ) => {
        
        setLoading(true) // Загрузка
        try {  
            if(body) {
                body = JSON.stringify(body)
                headers['Content-type'] = 'application/json'
            }
            const response = await fetch(url, { method, body, headers });
            const data = await response.json() 
            if (!response.ok) { 
                throw new Error(data.message || 'Что-то пошло не так');
            }
            setLoading(false); // Запрос отработал
            return data;

        } catch(e) {
            setLoading(false); // Запрос отработал
            setError(e.message) // !response.ok
            throw e;
        }
    }, []);

    // const clearError = () => setError(null);
    const clearError = useCallback(() => setError(null),  [])
    

    return { loading, request, error, clearError } // Export
}