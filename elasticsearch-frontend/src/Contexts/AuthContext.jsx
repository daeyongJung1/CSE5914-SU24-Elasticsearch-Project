import { useContext, createContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    // is in the format {username: "jwt"}
    const [user, setUser] = useState(null);

    useEffect(() => {
        const user = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        if (user && token) {
            setUser({ user, token });
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
    }, []);

    const login = async (username, password) => {
        try {
            const response = await axios.post('https://your-api-url/login', { username, password });
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', username);
            setUser({ user: username, token: response.data.token });
            axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        } catch (error) {
            console.error('Failed to login', error);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
    };

    const signup = (email, pass) => {

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