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

    // Ограничение до 300 Кб по ТЗ
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

        // Инициализация кроппера
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

    // 1. Получаем данные о положении картинки и рамки обрезки
    const canvasData = cropper.getCanvasData(); // Размеры отображаемой картинки
    const cropBoxData = cropper.getCropBoxData(); // Размеры рамки обрезки

    // 2. Генерируем чистый обрезанный кусок (работает через window.Cropper)
    const croppedCanvas = cropper.getCroppedCanvas();

    if (croppedCanvas) {
        // Очищаем внутренний контейнер
        croppedInner.innerHTML = '';

        // 3. Задаем внешнему окну точно такие же размеры, какие сейчас у картинки в редакторе
        resultOuter.style.width = `${canvasData.width}px`;
        resultOuter.style.height = `${canvasData.height}px`;

        // 4. Вычисляем точные координаты обрезка относительно левого верхнего угла картинки
        const relativeLeft = cropBoxData.left - canvasData.left;
        const relativeTop = cropBoxData.top - canvasData.top;

        // 5. Позиционируем внутренний контейнер обрезка на белом поле
        croppedInner.style.left = `${relativeLeft}px`;
        croppedInner.style.top = `${relativeTop}px`;
        croppedInner.style.width = `${cropBoxData.width}px`;
        croppedInner.style.height = `${cropBoxData.height}px`;

        // Создаем элемент изображения для обрезка
        const croppedImg = new Image();
        croppedImg.src = croppedCanvas.toDataURL('image/png');
        
        // Вставляем обрезок в позиционированное окно
        croppedInner.appendChild(croppedImg);

        // Показываем второе окно (Шаг 4)
        resultOuter.style.display = 'block';
        btnDownload.style.display = 'inline-block';

        // Плавно скроллим к результату
        resultOuter.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
});

// Кнопка скачивания сохраняет только чистый обрезанный фрагмент
btnDownload.addEventListener('click', () => {
    if (!cropper) return;
    const canvas = cropper.getCroppedCanvas();
    const link = document.createElement('a');
    link.download = 'cropped_result.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
});
