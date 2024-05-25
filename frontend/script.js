document.addEventListener('DOMContentLoaded', function() {
    let stars = document.getElementById('stars');
    let moon = document.getElementById('moon');
    let mountains_behind = document.getElementById('mountains_behind');
    let text = document.getElementById('text');
    let btn = document.getElementById('btn');
    let mountains_front = document.getElementById('mountains_front');
    let header = document.querySelector('header');

    window.addEventListener('scroll', function() {
        let value = window.scrollY;
        stars.style.left = value * 0.25 + 'px';
        moon.style.top = value * 1.05 + 'px';
        mountains_behind.style.top = value * 0.5 + 'px';
        mountains_front.style.top = value * 0 + 'px';
        text.style.marginRight = value * 4 + 'px';
        text.style.marginTop = value * 1.5 + 'px';
        btn.style.marginTop = value * 1.5 + 'px';
        header.style.top = value * 0.5 + 'px';
    });

    // Модальное окно
    var modal = document.getElementById("myModal");
    var closeButton = document.querySelector(".close-btn");

    btn.onclick = function(event) {
        event.preventDefault();
        modal.style.display = "block";
        setTimeout(function() {
            modal.classList.add("show");
        }, 10);
    }

    closeButton.onclick = function() {
        modal.classList.remove("show");
        setTimeout(function() {
            modal.style.display = "none";
        }, 500);
    }

    var dropZone = document.getElementById('drop-zone');
    var fileInput = document.getElementById('file-input');
    var fileButton = document.getElementById('file-button');
    var imagePlaceholder = document.querySelector('.image-placeholder');
    var fakeResult = document.querySelector('.Fake');
    var unFakeResult = document.querySelector('.UnFake');

    dropZone.addEventListener('dragover', function(event) {
        event.preventDefault();
        dropZone.classList.add('dragover');
    });

    dropZone.addEventListener('dragleave', function(event) {
        event.preventDefault();
        dropZone.classList.remove('dragover');
    });

    dropZone.addEventListener('drop', function(event) {
        event.preventDefault();
        dropZone.classList.remove('dragover');
        var files = event.dataTransfer.files;
        handleFiles(files);
    });

    fileButton.addEventListener('click', function() {
        fileInput.click();
    });

    fileInput.addEventListener('change', function(event) {
        var files = event.target.files;
        handleFiles(files);
    });

    function handleFiles(files) {
        if (files.length > 0) {
            var file = files[0];
            uploadFile(file);
            displayImage(file);
        }
    }

    function uploadFile(file) {
        var formData = new FormData();
        formData.append('file', file);

        console.log('Uploading file:', file.name);

        fetch('http://localhost:5000/upload', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(result => {
            console.log('Success:', result);
            displayResults(result); // Отображение результатов
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    function displayImage(file) {
        var reader = new FileReader();
        reader.onload = function(e) {
            imagePlaceholder.innerHTML = '<img src="' + e.target.result + '" alt="Uploaded Image">';
            imagePlaceholder.style.padding = '0'; // Убираем отступы при загрузке изображения
            imagePlaceholder.style.backgroundColor = 'transparent'; // Убираем фон при загрузке изображения
        };
        reader.readAsDataURL(file);
    }

    function displayResults(result) {
        // Очистка предыдущих результатов
        fakeResult.classList.add('hidden');
        unFakeResult.classList.add('hidden');

        // Отладочное сообщение для проверки результата
        console.log('Displaying results:', result);

        // Если score больше 0.5, то это не фейк, иначе это фейк
        let fakeScore = result.find(res => res.label === 'Fake').score * 100;
        let realScore = result.find(res => res.label === 'Real').score * 100;

        // Отладочные сообщения для проверки предсказаний
        console.log('Fake score:', fakeScore);
        console.log('Real score:', realScore);

        // Устанавливаем проценты для прогресс-баров
        let aiBar = document.querySelectorAll('.progress-bar-fill')[0];
        let humanBar = document.querySelectorAll('.progress-bar-fill')[1];

        aiBar.style.width = fakeScore + '%';
        humanBar.style.width = realScore + '%';

        if (realScore > 50) {
            unFakeResult.classList.remove('hidden');
        } else {
            fakeResult.classList.remove('hidden');
        }
    }

    // Добавляем плавный скроллинг для "О нас"
    document.querySelector('a[href="#about-section"]').addEventListener('click', function(event) {
        event.preventDefault();
        document.querySelector('#about-section').scrollIntoView({
            behavior: 'smooth'
        });
    });
});
