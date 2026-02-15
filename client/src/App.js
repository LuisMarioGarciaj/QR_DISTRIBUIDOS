import React, { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import axios from 'axios';
import './App.css';

function App() {
  const [scanResult, setScanResult] = useState(null);
  const [status, setStatus] = useState("Esperando escaneo...");
  const [pointData, setPointData] = useState(null);

  // IMPORTANTE: Cambia 'localhost' por tu IP local (ej. 192.168.0.10) 
  // para que funcione desde el Wi-Fi del celular.
  const API_URL = "http://localhost:3000/api/scan";

  useEffect(() => {
    const scanner = new Html5QrcodeScanner("reader", {
      fps: 10,
      qrbox: { width: 250, height: 250 },
    });

    scanner.render(onScanSuccess, onScanError);

    async function onScanSuccess(result) {
      setScanResult(result);
      setStatus("Validando...");

      try {
        const response = await axios.post(API_URL, {
          qrCodeValue: result
        });

        if (response.data.success) {
          setStatus("✅ ACCESO REGISTRADO");
          setPointData(response.data.data);
          // Puedes sonar un pitido o vibrar aquí
        }
      } catch (error) {
        setStatus("❌ QR NO RECONOCIDO");
        setPointData(null);
      }
    }

    function onScanError(err) {
      // Errores de escaneo constantes (ignorar)
    }

    return () => scanner.clear();
  }, []);

  return (
    <div className="App">
      <header className="header">
        <h1>UNIVALLE Patrullaje</h1>
      </header>

      <div id="reader"></div>

      <div className="status-card">
        <h3>Estado: {status}</h3>
        {pointData ? (
          <div>
            <p><strong>Ubicación:</strong> {pointData.name}</p>
            <p><strong>ID:</strong> {pointData.qrCodeValue}</p>
          </div>
        ) : (
          <p>Muestre el código QR del punto de control frente a la cámara.</p>
        )}
      </div>

      <button className="btn-reset" onClick={() => window.location.reload()}>
        Nueva Lectura
      </button>
    </div>
  );
}

export default App;