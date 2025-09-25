import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

const GetCode = () => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (name && phone && email) {
            try {
                await addDoc(collection(db, 'gate-users'), {
                    name,
                    phone,
                    email,
                    createdAt: new Date(),
                });
                setSubmitted(true);
            } catch (err) {
                console.error('Error writing to Firestore:', err);
                setError('There was an error submitting your information. Please try again.');
            }
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col justify-center sm:px-6 lg:px-8 font-heading">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-6 shadow-xl rounded-lg sm:px-10 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                    <div className="mb-6 text-center">
                        <img src="/Inara Logo.svg" alt="Logo" className="mx-auto h-8 w-auto mb-4" />
                        <h2 className="text-3xl font-heading font-extrabold text-gray-900">Get your access code</h2>
                    </div>

                    {!submitted ? (
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                                <div className="mt-1">
                                    <input id="name" name="name" type="text" required value={name} onChange={(e) => setName(e.target.value)} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm" />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                                <div className="mt-1">
                                    <input id="phone" name="phone" type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm" />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
                                <div className="mt-1">
                                    <input id="email" name="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm" />
                                </div>
                            </div>

                            {error && <p className="text-red-500 text-sm text-center pt-2">{error}</p>}

                            <div className="pt-2">
                                <button type="submit" className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none">
                                    Get Codes
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="text-center">
                            <h2 className="text-xl font-heading font-bold mb-2">Your Access Codes</h2>
                            <p className="text-gray-600 mb-4">Use one of the following codes to verify:</p>
                            <div className="bg-gray-100 p-4 rounded-lg">
                                <ul className="space-y-2 text-lg font-heading text-gray-800">
                                    <li>396000</li>
                                    <li>123456</li>
                                    <li>789012</li>
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GetCode;
