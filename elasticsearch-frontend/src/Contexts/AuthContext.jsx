import { data } from "autoprefixer";
import { useContext, createContext, useState, useEffect } from "react";
import axios from "axios";
import { useSnackbar } from "notistack";

const AuthContext = createContext(null);

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    // is in the format {username: "jwt"}
    const [user, setUser] = useState(null);
    const { enqueueSnackbar } = useSnackbar()


    useEffect(() => {
        const user = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        if (user && token) {
            setUser({ user, token });
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
    }, []);

    const login = async (username, password) => {
        return new Promise((resolve, reject) => {
            axios.post(process.env.REACT_APP_API_URL + '/user/login', {
                username,
                password
            }).then(({ data }) => {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', username);
                setUser({ user: username, token: data.token });
                axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
                resolve(data)
            }).catch(ex => {
                reject(ex)
            });

        })
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
        enqueueSnackbar('Logout successful!', {
            variant: 'success'
        });
    };

    const signup = (username, password) => {
        return new Promise((resolve, reject) => {
            axios.post(process.env.REACT_APP_API_URL + '/user/signup', {
                username: username,
                password: password
            }).then(({ data }) => {
                resolve(data)
            }).catch(ex => {
                console.error(ex)
                reject(ex)
            })
        })
    }

    if (!user) {
        let token = localStorage.getItem('token');
        let username = localStorage.getItem('user');
        setUser({ user: username, token: data.token });
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    const value = {
        user,
        login,
        logout,
        signup
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}