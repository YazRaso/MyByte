Quagga.init({
    inputStream: {
        name: "Live",
        type: "LiveStream",
        target: document.querySelector('#interactive'),
        constraints: {
            width: 640,
            height: 480,
            facingMode: "environment"
        },
    },
    decoder: {
        readers: ["ean_reader"] 
    }
}, function(err) {
    if (err) {
        console.error("Failed to initialize QuaggaJS:", err);
        return;
    }
    console.log("QuaggaJS initialized. Ready to scan barcodes.");
    
    // Add transform to mirror the video horizontally
    const video = document.querySelector('#interactive video');
    if (video) {
        video.style.transform = 'scaleX(-1)';
    }
    
    Quagga.start();
});


Quagga.onDetected(function(result) {
    const barcode = result.codeResult.code;
    console.log("Barcode detected:", barcode);


    fetch('/scan', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ barcode: barcode }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            document.getElementById('result').innerText = data.error;
        } else {
            document.getElementById('result').innerText = `Nutrition Info: ${JSON.stringify(data)}`;
        }
    })
    .catch(error => {
        console.error("Error sending barcode to server:", error);
    });
    Quagga.stop()
});