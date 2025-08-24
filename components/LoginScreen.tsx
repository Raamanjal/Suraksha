import React, { useState } from 'react';
import { ShieldIcon } from './Icons';

interface LoginScreenProps {
  onLogin: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [otpNotification, setOtpNotification] = useState('');

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length >= 10) {
      setOtpNotification('For testing, your OTP is 123456');
      setStep(2);
    }
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp === '123456') {
      setOtpError('');
      onLogin();
    } else {
      setOtpError('Invalid OTP. Please try again.');
    }
  };

  return (
    <div className="max-w-sm mx-auto h-[100dvh] bg-black text-white flex flex-col justify-center items-center p-8">
      <div className="text-center mb-12">
        <ShieldIcon className="w-16 h-16 mx-auto text-red-500" />
        <h1 className="text-4xl font-bold tracking-wider uppercase mt-4">SURAKSHA</h1>
        <p className="text-gray-400 mt-2">Your Personal Safety Companion</p>
      </div>

      {step === 1 && (
        <form onSubmit={handlePhoneSubmit} className="w-full">
          <h2 className="text-xl text-center mb-6">Enter Your Mobile Number</h2>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">+91</span>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
              placeholder="98765 43210"
              className="w-full bg-gray-900 border border-gray-700 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-red-500"
              maxLength={10}
            />
          </div>
          <button type="submit" className="w-full bg-red-600 hover:bg-red-700 rounded-lg py-3 mt-6 font-bold transition-colors">
            Get OTP
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleOtpSubmit} className="w-full">
          <h2 className="text-xl text-center mb-2">Enter OTP</h2>
          <p className="text-gray-400 text-center text-sm mb-2">Sent to +91 {phone}</p>
          {otpNotification && <p className="text-green-400 text-center text-sm mb-4">{otpNotification}</p>}
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="_ _ _ _ _ _"
            className="w-full bg-gray-900 border border-gray-700 rounded-lg py-3 px-4 text-center tracking-[1em] text-2xl focus:outline-none focus:ring-2 focus:ring-red-500"
            maxLength={6}
            autoFocus
          />
          {otpError && <p className="text-red-500 text-center text-sm mt-2">{otpError}</p>}
          <button type="submit" className="w-full bg-red-600 hover:bg-red-700 rounded-lg py-3 mt-6 font-bold transition-colors">
            Verify
          </button>
           <button onClick={() => { setStep(1); setOtpError(''); setOtpNotification(''); setOtp(''); }} className="w-full text-gray-400 hover:text-white py-3 mt-2 font-bold transition-colors text-sm">
            Change Number
          </button>
        </form>
      )}
    </div>
  );
};

export default LoginScreen;
