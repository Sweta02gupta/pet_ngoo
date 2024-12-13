import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QrScanner from 'react-qr-scanner';
import CryptoJS from 'crypto-js'
const ScanQR = () => {
    const navigate = useNavigate();
    const [scannedData, setScannedData] = useState(null);
    const [loginDetails, setLoginDetails] = useState(null);
    const [isScanning, setIsScanning] = useState(true);

    useEffect(() => {
        if (localStorage.getItem("AFA_user")) {
            setLoginDetails(JSON.parse(localStorage.getItem("AFA_user")));
        }
    }, []);

    const decryptData = (encryptedData) => {
        // Decrypt the scanned data using the same secret key used for encryption
        const decryptedData = CryptoJS.AES.decrypt(encryptedData, `${import.meta.env.VITE_QR_SECRET_KEY}`).toString(CryptoJS.enc.Utf8);
        console.log("Decrypted Data:", decryptedData);
        return decryptedData;
    };

    const handleScan = (data) => {
        if (isScanning && data) {
            console.log(data);
            const parsedDetails = JSON.parse(data.text);
            console.log(parsedDetails.Data);
            setIsScanning(false);
            const decryptedData = decryptData(parsedDetails.Data);
            console.log("Decrypted Data:", decryptedData);
            setScannedData(decryptedData);
            const parsedData = JSON.parse(decryptedData);
            let route;
            if (loginDetails?.role.includes("ViewTrapper")) {
                if (parsedData.Animal === "Dog" && parsedData.Type === "Sterilization") {
                    route = "/user/ViewTrapper/dog";
                } else if (parsedData.Animal === "Cat" && parsedData.Type === "Sterilization") {
                    route = "/user/ViewTrapper/cat";
                } else if (parsedData.Animal === "Dog" && parsedData.Type === "Rescue") {
                    route = "/user/ViewRescueTrapper/dog";
                } else if (parsedData.Animal === "Cat" && parsedData.Type === "Rescue") {
                    route = "/user/ViewRescueTrapper/cat";
                }
            } else if (loginDetails?.role.includes("ViewAdmin")) {
                if (parsedData.Animal === "Dog" && parsedData.Type === "Sterilization") {
                    route = "/user/ViewAdmin/dog";
                } else if (parsedData.Animal === "Cat" && parsedData.Type === "Sterilization") {
                    route = "/user/ViewAdmin/cat";
                } else if (parsedData.Animal === "Dog" && parsedData.Type === "Rescue") {
                    route = "/user/ViewRescueAdmin/dog";
                } else if (parsedData.Animal === "Cat" && parsedData.Type === "Rescue") {
                    route = "/user/ViewRescueAdmin/cat";
                }
            } else if (loginDetails?.role.includes("ViewVet")) {
                if (parsedData.Animal === "Dog" && parsedData.Type === "Sterilization") {
                    route = "/user/ViewVet/dog";
                } else if (parsedData.Animal === "Cat" && parsedData.Type === "Sterilization") {
                    route = "/user/ViewVet/cat";
                } else if (parsedData.Animal === "Dog" && parsedData.Type === "Rescue") {
                    route = "/user/ViewRescueVet/dog";
                } else if (parsedData.Animal === "Cat" && parsedData.Type === "Rescue") {
                    route = "/user/ViewRescueVet/cat";
                }
            }
            navigate(route, { state: { scannedData: decryptedData } });
            console.log("Scanned Data:", decryptedData);
            console.log("User Data:", loginDetails);
            
        }
    };

    const handleError = (err) => {
        console.error(err);
    };

    return (
        <div className="flex flex-col items-center justify-center h-full">
            <h1 className="text-3xl font-bold mb-8">Scan QR Code</h1>
            <div className="relative w-full max-w-md">
                <QrScanner
                    onScan={handleScan}
                    onError={handleError}
                    style={{ width: '100%', maxHeight: 'calc(100vh - 200px)' }}
                    constraints={{
                        video: { facingMode: 'environment' },
                      }}
                />
            </div>
        </div>
    );
};

export default ScanQR;
