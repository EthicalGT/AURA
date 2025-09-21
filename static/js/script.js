const video = document.getElementById('camera');
const captureBtn = document.getElementById('capture');
const closeBtn = document.getElementById('close');
const canvas = document.getElementById('snapshot');
const photo = document.getElementById('photo');
const main = document.querySelector('main');

let stream;

async function scanOpener() {
    try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
        main.style.display = 'none';
        video.style.display = 'block';
        captureBtn.style.display = 'inline-block';
        closeBtn.style.display = 'inline-block';
    } catch (err) {
        alert("Camera access denied or not available.");
        console.error(err);
    }
}

captureBtn.addEventListener('click', () => {
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL('image/png');
    photo.src = dataUrl;
    photo.style.display = 'block';

    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }
    video.style.display = 'none';
    main.style.display = 'block';
    captureBtn.style.display = 'none';
    closeBtn.style.display = 'none';
});

closeBtn.addEventListener('click', () => {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }
    video.style.display = 'none';
    main.style.display = 'block';
    captureBtn.style.display = 'none';
    closeBtn.style.display = 'none';
});

// Attach scanOpener to all scan buttons/icons
document.querySelectorAll('.scan-trigger').forEach(el => {
    el.addEventListener('click', scanOpener);
});
