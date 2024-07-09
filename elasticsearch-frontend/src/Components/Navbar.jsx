import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../Contexts/AuthContext"

export default function NavBar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate()


    return (
        <nav className="bg-gray-800 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex space-x-4">
                    <Link to="/" className="text-white py-2 px-4 hover:bg-gray-700 rounded">Home</Link>
                </div>
                <div>
                    {user ? (
                        <div className="">
                            <button onClick={() => navigate('/dashboard')} className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded transition duration-300 mr-5">Dashboard</button>
                            <button onClick={logout} className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded transition duration-300">Log out</button>
                        </div>
                    ) : (
                        <button onClick={() => navigate('/login')} className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded transition duration-300">Login</button>
                    )}
                </div>
            </div>
        </nav>
    )
}