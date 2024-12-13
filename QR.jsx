import React, { useState, useEffect } from "react";
import QRCode from "react-qr-code";
import CryptoJS from "crypto-js";

const QR = ({ trap, animalType, size }) => {
  const [qrData, setQRData] = useState("");
  const [type, setType] = useState("Sterilization")
  useEffect(() => {
    if (trap) {
      // Encrypt data before setting as QR code value
      const encryptedData = encryptData({
        CaseNo: trap.CaseNo,
        FileNo: trap.FileNo,
        Animal: animalType,
        Type: type
      });

      const jsonData = JSON.stringify({
        Text: `${import.meta.env.VITE_QR_PLACEHOLDER_TEXT}`,
        Data: encryptedData
      });

      setQRData(jsonData);
    }
  }, [trap]);

  const encryptData = (data) => {
    // Convert data to string
    const jsonData = JSON.stringify(data);
    // Encrypt data using AES encryption
    const encrypted = CryptoJS.AES.encrypt(jsonData, `${import.meta.env.VITE_QR_SECRET_KEY}`).toString();
    return encrypted;
  };

  return (
    <div className="flex flex-col items-center border border-gray-300 rounded-md m-3 p-3 shadow-lg">
      <div className="text-center font-semibold text-md text-gray-600"> S{trap.CaseNo}</div>
      <div className="mb-4 text-center font-semibold text-md text-gray-600"> {animalType}</div>
      <div className="flex justify-center">
        <div className="border border-gray-300 rounded-lg p-2">
          <QRCode value={qrData} size={size} />
        </div>
      </div>
    </div>
  );
};

export default QR;
