import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const Gate = () => {
  const [code, setCode] = useState(Array(6).fill(""));
  const [error, setError] = useState("");
  const [focusedIndex, setFocusedIndex] = useState(null);
  const navigate = useNavigate();
  const inputsRef = useRef([]);

  const handleInputChange = (e, index) => {
    const { value } = e.target;
    if (!/^[0-9]$/.test(value) && value !== "") return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (/^[0-9]{6}$/.test(pastedData)) {
      const newCode = pastedData.split('');
      setCode(newCode);
      inputsRef.current[5].focus();
    }
  };

  const handleVerify = () => {
    const enteredCode = code.join("");
    const validCodes = ["396000", "123456", "789012"]; // Valid passcodes
    if (validCodes.includes(enteredCode)) {
      sessionStorage.setItem("hasGateAccess", "true");
      navigate("/home");
    } else {
      setError("Invalid verification code. Please try again.");
      setCode(Array(6).fill(""));
      inputsRef.current[0].focus();
    }
  };

  const handleCancel = () => {
    setCode(Array(6).fill(""));
    setError("");
    inputsRef.current[0].focus();
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center font-heading">
      <div className="relative w-full max-w-md bg-white text-gray-900 rounded-lg shadow-lg p-8 m-4 border border-gray-200">
        <img src="/Inara Smiley.svg" alt="Watermark" className="absolute top-4 right-4 h-16 w-16 opacity-70" />
        <div className="text-center mb-6">
          <img src="/Inara Logo.svg" alt="Logo" className="mx-auto h-8 w-auto mb-4" />
          <h1 className="text-xl font-heading font-bold text-gray-900">[GATE ACCESS]</h1>
        </div>

        <div className="mb-8">
          <div className="flex items-center mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 text-gray-400"><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><rect x="7" y="7" width="10" height="10" rx="1" /></svg>
            <h2 className="text-lg font-heading font-semibold text-gray-800">Scan QR code</h2>
          </div>
          <p className="text-gray-500 text-sm mb-4 ml-9">
            Scan the QR code to get your verification code. You will need to provide your name and phone number.
          </p>
          <div className="bg-gray-50 p-4 rounded-lg flex items-center gap-4">
            <div className="p-2 bg-white rounded-md border">
              <img src="/qr-code.svg" alt="QR Code" className="w-24 h-24" />
            </div>
            <div className="flex-1">
                <p className="text-sm text-gray-500 mb-2">
                    Can't scan the QR code?
                </p>
                <a href="/get-code" target="_blank" rel="noopener noreferrer" className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-heading font-bold py-2 px-4 rounded-md text-sm flex items-center justify-center gap-2">
                    Get code manually
                </a>
            </div>
          </div>
        </div>

        <div>
           <div className="flex items-center mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 text-gray-400"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="7" y1="7" x2="7.01" y2="7" /><line x1="12" y1="7" x2="12.01" y2="7" /><line x1="17" y1="7" x2="17.01" y2="7" /><line x1="7" y1="12" x2="7.01" y2="12" /><line x1="12" y1="12" x2="12.01" y2="12" /><line x1="17" y1="12" x2="17.01" y2="12" /><line x1="7" y1="17" x2="7.01" y2="17" /><line x1="12" y1="17" x2="12.01" y2="17" /><line x1="17" y1="17" x2="17.01" y2="17" /></svg>
            <h2 className="text-lg font-heading font-semibold text-gray-800">Enter verification code</h2>
          </div>
          <p className="text-gray-500 text-sm mb-4 ml-9">
            Enter the 6-digit code from the passcode page.
          </p>
          <div className="flex justify-center gap-2 mb-4" onPaste={handlePaste}>
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputsRef.current[index] = el)}
                type={index === focusedIndex ? "text" : "password"}
                maxLength="1"
                value={digit}
                onChange={(e) => handleInputChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onFocus={() => setFocusedIndex(index)}
                onBlur={() => setFocusedIndex(null)}
                className="w-12 h-14 bg-gray-100 border-2 border-gray-300 rounded-md text-center text-2xl font-heading font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
              />
            ))}
          </div>
           {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
        </div>

        <div className="flex justify-end items-center gap-4 mt-8">
          <button
            onClick={handleCancel}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-heading font-bold py-2 px-6 rounded-md transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleVerify}
            className="bg-slate-900 hover:bg-slate-700 text-white font-heading font-bold py-2 px-6 rounded-md transition-colors"
          >
            Verify
          </button>
        </div>
      </div>
    </div>
  );
};

export default Gate;
