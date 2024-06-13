import { Link } from "react-router-dom"
import { useAuth } from "../Contexts/AuthContext"

export default function NavBar() {
    const { user } = useAuth();

    return (
        <nav className="bg-gray-800 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex space-x-4">
                    <Link to="/" className="text-white py-2 px-4 hover:bg-gray-700 rounded">Home</Link>
                    <Link to="/about" className="text-white py-2 px-4 hover:bg-gray-700 rounded">About</Link>
                    <Link to="/contact" className="text-white py-2 px-4 hover:bg-gray-700 rounded">Contact</Link>
                    <Link to="/user/john" className="text-white py-2 px-4 hover:bg-gray-700 rounded">Profile</Link>
                </div>
                <div>
                    {user ? (
                        <button className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded transition duration-300">Log out</button>
                    ) : (
                        <Link to="/login" className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded transition duration-300">Log in</Link>
                    )}
                </div>
            </div>
        </nav>
    )
}