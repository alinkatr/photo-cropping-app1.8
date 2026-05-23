const fileInput = document.getElementById('file-input');
const image = document.getElementById('image');
const btnCrop = document.getElementById('btn-crop');
const btnDownload = document.getElementById('btn-download');
const resultOuter = document.getElementById('result-outer-box');
const croppedInner = document.getElementById('cropped-inner-wrapper');

let cropper;

fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 300 * 1024) {
        alert('File is too large! Max 300Kb.');
        return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
        image.src = event.target.result;
        resultOuter.style.display = 'none';
        btnDownload.style.display = 'none';

        if (cropper) cropper.destroy();

        cropper = new window.Cropper(image, {
            viewMode: 1,
            dragMode: 'none',
            autoCropArea: 0.6,
            background: true,
            responsive: true,
            zoomable: false,
            movable: false
        });
    };
    reader.readAsDataURL(file);
});

btnCrop.addEventListener('click', () => {
    if (!cropper) return;

    const canvasData = cropper.getCanvasData(); 
    const cropBoxData = cropper.getCropBoxData(); 

    const croppedCanvas = cropper.getCroppedCanvas();

    if (croppedCanvas) {
        croppedInner.innerHTML = '';

        resultOuter.style.width = `${canvasData.width}px`;
        resultOuter.style.height = `${canvasData.height}px`;

        const relativeLeft = cropBoxData.left - canvasData.left;
        const relativeTop = cropBoxData.top - canvasData.top;

        croppedInner.style.left = `${relativeLeft}px`;
        croppedInner.style.top = `${relativeTop}px`;
        croppedInner.style.width = `${cropBoxData.width}px`;
        croppedInner.style.height = `${cropBoxData.height}px`;

        const croppedImg = new Image();
        croppedImg.src = croppedCanvas.toDataURL('image/png');
        
        croppedInner.appendChild(croppedImg);

        resultOuter.style.display = 'block';
        btnDownload.style.display = 'inline-block';

        resultOuter.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
});

btnDownload.addEventListener('click', () => {
    if (!cropper) return;
    const canvas = cropper.getCroppedCanvas();
    const link = document.createElement('a');
    link.download = 'cropped_result.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
});
