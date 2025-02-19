import React, { useEffect, useRef } from "react";
import Quagga from "quagga";

function BarcodeScanner() {
  const scannerContainerRef = useRef(null);
  const resultRef = useRef(null);
  let isScanning = false; // Track whether Quagga is running

  useEffect(() => {
    const scanButton = document.getElementById("scan-button");

    if (!scannerContainerRef.current || !scanButton || !resultRef.current) {
      console.error("One or more elements are missing from the DOM.");
      return;
    }

    const handleScan = () => {
      if (isScanning) {
        console.warn("Quagga is already running.");
        return;
      }

      scannerContainerRef.current.style.display = "block";
      isScanning = true; // Set scanning state

      Quagga.init(
        {
          inputStream: {
            name: "Live",
            type: "LiveStream",
            target: scannerContainerRef.current,
            constraints: {
              width: 640,
              height: 480,
              facingMode: "environment",
            },
          },
          decoder: {
            readers: ["ean_reader"],
          },
        },
        function (err) {
          if (err) {
            console.error("Failed to initialize QuaggaJS:", err);
            isScanning = false;
            return;
          }
          console.log("QuaggaJS initialized. Ready to scan barcodes.");

          const video = document.querySelector("#interactive video");
          if (video) {
            video.style.transform = "scaleX(-1)";
          }
          Quagga.start();
        }
      );

      Quagga.onDetected((result) => {
        const barcode = result.codeResult.code;
        console.log("Barcode detected:", barcode);

        fetch("http://127.0.0.1:5000/scan", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ barcode: barcode }),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.error) {
              resultRef.current.innerText = data.error;
            } else {
              resultRef.current.innerText = `Nutrition Info: ${JSON.stringify(
                data
              )}`;
            }
          })
          .catch((error) => {
            console.error("Error sending barcode to server:", error);
          });

        scannerContainerRef.current.style.display = "none";
        if (isScanning) {
          Quagga.stop();
          isScanning = false;
        }
      });
    };

    scanButton.addEventListener("click", handleScan);

    return () => {
      scanButton.removeEventListener("click", handleScan);
      if (isScanning) {
        Quagga.stop();
        isScanning = false;
      }
    };
  }, []);

  return (
    <div>
      <button id="scan-button">Scan Barcode</button>
      <div ref={scannerContainerRef} id="scanner-container" style={{ display: "none" }}>
        <div id="interactive" className="viewport"></div>
      </div>
      <p ref={resultRef} id="result"></p>
    </div>
  );
}

export default BarcodeScanner;
