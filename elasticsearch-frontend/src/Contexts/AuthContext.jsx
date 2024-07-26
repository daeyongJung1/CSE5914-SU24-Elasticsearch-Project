import { useContext, createContext, useState, useEffect } from "react";
import axios from "axios";
import { useSnackbar } from "notistack";

const AuthContext = createContext(null);

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    /*
        {
            user: decoded JWT
        }
    */
    const [token, setToken] = useState(null)
    const [loadingAuth, setLoadingAuth] = useState(true);

    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        const user = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        if (user && token) {
            setUser(JSON.parse(user));
            setToken(token)
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
        setLoadingAuth(false);
    }, []);

    const login = async (username, password) => {
        return new Promise((resolve, reject) => {
            axios.post(process.env.REACT_APP_API_URL + '/user/login', {
                username,
                password
            }).then(({ data }) => {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                setUser(data.user);
                setToken(data.token)
                axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
                resolve(data);
            }).catch(ex => {
                reject(ex);
            });
        });
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
        setToken(null)
        enqueueSnackbar('Logout successful!', {
            variant: 'success'
        });
    };

    const signup = (username, password) => {
        return new Promise((resolve, reject) => {
            axios.post(process.env.REACT_APP_API_URL + '/user/signup', {
                username,
                password
            }).then(({ data }) => {
                resolve(data);
            }).catch(ex => {
                console.error(ex);
                reject(ex);
            });
        });
    };

    const processUserUpdate = (data) => {
        try{
            let {token, user} = data
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
            setUser(user);
            setToken(token);
        }
        catch(ex){

        }
    }

    const value = {
        user,
        token,
        processUserUpdate,
        loadingAuth,
        login,
        logout,
        signup
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
