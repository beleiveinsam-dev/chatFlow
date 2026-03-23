import React, { useContext } from "react";
import assets from "../assets/assets";
import { useState } from "react";
import { AuthContext } from "../../context/AuthContext";

const LoginPage = () => {
    const [currState, setCurrState] = useState("Sign up");
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [bio, setBio] = useState("");
    const [isDataSubmitted, setIsDataSubmitted] = useState(false);

    const { login } = useContext(AuthContext);

    const onSubmitHandler = (e) => {
        e.preventDefault();

        if (currState === "Sign up" && !isDataSubmitted) {
            setIsDataSubmitted(true);
            return;
        }

        login(currState === "Sign up" ? "signup" : "login", {
            fullName,
            email,
            password,
            bio,
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center gap-12 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl p-6">
            {/* Left */}
            <div className="text-center">
                <div className="relative">
                    <img
                        src={assets.logo_big}
                        alt=""
                        className="w-[min(35vw,300px)] mx-auto"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-2xl"></div>
                </div>
                <div className="mt-6 max-sm:hidden">
                    <h1 className="text-3xl font-light text-white mb-2">
                        Welcome to ChatFlow
                    </h1>
                    <p className="text-gray-400">
                        Learn, Chat, Flow - Connect with friends instantly
                    </p>
                </div>
            </div>

            {/* Right */}
            <form
                onSubmit={onSubmitHandler}
                className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 text-white p-8 flex flex-col gap-6 rounded-2xl shadow-2xl w-full max-w-md"
            >
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-light">{currState}</h2>
                    {isDataSubmitted && (
                        <button
                            type="button"
                            onClick={() => setIsDataSubmitted(false)}
                            className="p-2 rounded-full hover:bg-gray-800/50 transition-colors"
                        >
                            <img
                                src={assets.arrow_icon}
                                alt=""
                                className="w-5 h-5"
                            />
                        </button>
                    )}
                </div>

                {currState === "Sign up" && !isDataSubmitted && (
                    <div className="space-y-2">
                        <label className="text-sm text-gray-300">
                            Full Name
                        </label>
                        <input
                            type="text"
                            className="w-full bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white placeholder-gray-400 transition-all"
                            placeholder="Enter your full name"
                            onChange={(e) => setFullName(e.target.value)}
                            value={fullName}
                            required
                        />
                    </div>
                )}

                {!isDataSubmitted && (
                    <>
                        <div className="space-y-2">
                            <label className="text-sm text-gray-300">
                                Email
                            </label>
                            <input
                                type="email"
                                className="w-full bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white placeholder-gray-400 transition-all"
                                placeholder="Enter your email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-gray-300">
                                Password
                            </label>
                            <input
                                type="password"
                                className="w-full bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white placeholder-gray-400 transition-all"
                                placeholder="Enter your password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </>
                )}

                {currState === "Sign up" && isDataSubmitted && (
                    <div className="space-y-2">
                        <label className="text-sm text-gray-300">Bio</label>
                        <textarea
                            className="w-full bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white placeholder-gray-400 transition-all resize-none"
                            placeholder="Tell us about yourself..."
                            value={bio}
                            required
                            rows={4}
                            onChange={(e) => setBio(e.target.value)}
                        ></textarea>
                    </div>
                )}

                <button
                    type="submit"
                    className="py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-medium transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                    {currState === "Sign up" ? "Create Account" : "Login Now"}
                </button>

                <div className="flex items-center gap-3 text-sm text-gray-400">
                    <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-gray-600 bg-gray-800/50"
                    />
                    <p>I agree to the terms of use and privacy policy</p>
                </div>

                <div className="text-center">
                    {currState === "Sign up" ? (
                        <p className="text-sm text-gray-400">
                            Already have an account?{" "}
                            <button
                                type="button"
                                className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                                onClick={() => {
                                    setCurrState("Login");
                                    setIsDataSubmitted(false);
                                }}
                            >
                                Login here
                            </button>
                        </p>
                    ) : (
                        <p className="text-sm text-gray-400">
                            Don't have an account?{" "}
                            <button
                                type="button"
                                className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                                onClick={() => setCurrState("Sign up")}
                            >
                                Sign up here
                            </button>
                        </p>
                    )}
                </div>
            </form>
        </div>
    );
};

export default LoginPage;
