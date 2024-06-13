import React, { useState } from 'react';

export default function Home() {
    // 'text' or 'link'
    const [inputType, setInputType] = useState('link');
    const [userInput, setUserInput] = useState(null);

    const submitUserInput = () => {

    }

    return (
        <div className="flex grow flex-col items-center justify-center bg-gray-100">
            <input
                type={inputType === 'link' ? "url" : "text"}
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder={inputType === 'text' ? "Enter text here" : "Enter link here"}
                className={`form-input mt-2 block transition-all duration-500 ease-in-out ${inputType === 'text' ? 'w-1/2 h-32 px-4 py-3' : 'w-1/3 h-10 px-3 py-2'
                    } text-gray-700 border rounded-md focus:outline-none focus:shadow-outline`}
            />
            <div className="mt-4 flex rounded-full bg-gray-300 p-1 w-48 justify-center">
                <button
                    onClick={() => setInputType('link')}
                    className={`flex-1 text-center rounded-full py-2 ${inputType === 'link' ? 'bg-blue-500 text-white' : 'text-gray-700'
                        } transition-colors duration-300 ease-in-out`}
                >
                    Link
                </button>
                <button
                    onClick={() => setInputType('text')}
                    className={`flex-1 text-center rounded-full py-2 ${inputType === 'text' ? 'bg-blue-500 text-white' : 'text-gray-700'
                        } transition-colors duration-300 ease-in-out`}
                >
                    Text Input
                </button>
            </div>
        </div>
    );
}
