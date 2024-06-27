import { useState } from "react"
import { useAuth } from "../Contexts/AuthContext"
import { Navigate, Link } from "react-router-dom"

export default function SignUp() {
    const [username, setUsername] = useState(null);
    const [password, setPassword] = useState(null);
    const [passwordVerification, setPasswordVerification] = useState(null);

    const { user } = useAuth()

    if (user) return (<Navigate to="/" replace />)

    const handleSubmit = (e) => {
        if (password != passwordVerification) {
            return alert("Passwords do not match!")
        }
    }

    return (
        <div className="grow flex justify-center items-center bg-gray-100">
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 lg:w-1/4 flex flex-col justify-evenly">
                <div>
                    <div className="mb-5 mt-5 font-bold text-3xl">Join Us!</div>
                    <label className="block text-gray-700 text-lg font-bold mb-2" htmlFor="username">
                        Email
                    </label>
                    <input
                        id="username"
                        type="text"
                        placeholder="Email"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-5"
                    />
                </div>
                <div>
                    <label className="block text-gray-700 text-lg font-bold mb-2" htmlFor="password">
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        placeholder="***************"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline mb-5"
                    />
                </div>
                <div>
                    <label className="block text-gray-700 text-lg font-bold mb-2" htmlFor="password">
                        Verify Password
                    </label>
                    <input
                        id="password-verification"
                        type="password"
                        placeholder="***************"
                        value={passwordVerification}
                        onChange={(e) => setPasswordVerification(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline mb-5"
                    />
                </div>
                <div className="flex items-center justify-between">
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded focus:outline-none focus:shadow-outline mt-5"
                        type="button"
                        onClick={handleSubmit}
                    >
                        Create Account
                    </button>
                    <Link
                        to="/login" // Path to your registration page
                        className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
                    >
                        Already have an account
                    </Link>
                </div>
            </div>
        </div>
    )
}