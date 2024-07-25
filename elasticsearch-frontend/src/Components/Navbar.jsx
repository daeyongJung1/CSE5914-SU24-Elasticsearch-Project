import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContext";
import { useEffect } from "react";

export default function NavBar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const style = document.createElement('style');
        style.innerHTML = `
            .reveal-button .text {
                max-width: 0;
                overflow: hidden;
                white-space: nowrap;
                transition: max-width 0.3s ease;
            }

            .reveal-button:hover .text {
                max-width: 100px; /* Adjust the width to your preference */
            }

            .reveal-button-left .text {
                margin-left: 5;
                max-width: 0;
                overflow: hidden;
                white-space: nowrap;
                transition: max-width 0.3s ease;
            }

            .reveal-button-left:hover .text {
                max-width: 100px; /* Adjust the width to your preference */
            }
        `;
        document.head.appendChild(style);
        return () => {
            document.head.removeChild(style);
        };
    }, []);

    return (
        <nav className="bg-gray-800 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex space-x-4">
                    <Link to="/" className="reveal-button flex items-center text-white py-2 px-4 rounded hover:bg-gray-700 transition duration-300">
                        <i className="fas fa-search"></i>
                        <span className="text ml-2">Home</span>
                    </Link>
                </div>
                <div className="flex space-x-4">
                    {user ? (
                        <div className="flex space-x-4 items-center">
                            <button 
                                onClick={() => navigate('/dashboard')} 
                                className="reveal-button-left flex items-center bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded transition duration-300"
                            >
                                <span className="text mr-2">Dashboard</span>
                                <i className="fas fa-user mr-2"></i>
                            </button>
                            <button 
                                onClick={logout} 
                                className="reveal-button-left flex items-center bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded transition duration-300"
                            >
                                <span className="text mr-2">Log out</span>
                                <i className="fas fa-sign-out-alt"></i>
                            </button>
                        </div>
                    ) : (
                        <button 
                            onClick={() => navigate('/login')} 
                            className="reveal-button-left flex items-center bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded transition duration-300"
                        >
                            <span className="text mr-2">Login</span>
                            <i className="fas fa-sign-in-alt"></i>
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
}
