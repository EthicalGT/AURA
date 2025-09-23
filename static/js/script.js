function getLocation(imageData) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;

                console.log("Captured Image + Location:");
                console.log("Image Data:", imageData);
                console.log("Latitude:", lat, "Longitude:", lng);

                fetch("/upload/", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRFToken": getCookie("csrftoken")
                    },
                    body: JSON.stringify({
                        image: imageData,
                        latitude: lat,
                        longitude: lng
                    })
                });
            },
            (error) => {
                console.error("Location error:", error);
            }
        );
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

const video = document.getElementById('camera');
const captureBtn = document.getElementById('capture');
const closeBtn = document.getElementById('close');
const switchBtn = document.getElementById('switch');
const canvas = document.getElementById('snapshot');
const photo = document.getElementById('photo');
const main = document.querySelector('main');

let stream;
let currentFacingMode = "user"; // default: front camera

async function startCamera(facingMode = "user") {
    try {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
        stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: facingMode }
        });
        video.srcObject = stream;
        main.style.display = 'none';
        video.style.display = 'block';
        captureBtn.style.display = 'inline-block';
        closeBtn.style.display = 'inline-block';
        switchBtn.style.display = 'inline-block';
    } catch (err) {
        alert("Camera access denied or not available.");
        console.error(err);
    }
}

async function scanOpener() {
    currentFacingMode = "user"; // reset to front when first opened
    await startCamera(currentFacingMode);
}

captureBtn.addEventListener('click', () => {
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL('image/png');
    photo.src = dataUrl;
    photo.style.display = 'block';

    getLocation(dataUrl);

    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }
    video.style.display = 'none';
    main.style.display = 'block';
    captureBtn.style.display = 'none';
    closeBtn.style.display = 'none';
    switchBtn.style.display = 'none';
});

closeBtn.addEventListener('click', () => {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }
    video.style.display = 'none';
    main.style.display = 'block';
    captureBtn.style.display = 'none';
    closeBtn.style.display = 'none';
    switchBtn.style.display = 'none';
});

switchBtn.addEventListener('click', async () => {
    currentFacingMode = currentFacingMode === "user" ? "environment" : "user";
    await startCamera(currentFacingMode);
});

document.querySelectorAll('.scan-trigger').forEach(el => {
    el.addEventListener('click', scanOpener);
});