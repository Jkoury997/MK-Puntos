import React, { useState } from 'react';

export function InputOTP({ children, maxLength, value, onChange }) {
  const [otp, setOtp] = useState(new Array(maxLength).fill(""));

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;

    const newOtp = [...otp];
    newOtp[index] = element.value;

    setOtp(newOtp);
    onChange && onChange(newOtp.join(""));

    // Focus next input
    if (element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  return (
    <div className="flex space-x-2">
      {children.map((child, index) => {
        return React.cloneElement(child, {
          key: index,
          value: otp[index],
          onChange: (e) => handleChange(e.target, index),
        });
      })}
    </div>
  );
}

export function InputOTPGroup({ children }) {
  return <>{children}</>;
}

export function InputOTPSlot(props) {
  return (
    <input
      className="w-10 h-10 text-center border-b-2 border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:outline-none"
      maxLength="1"
      {...props}
    />
  );
}
