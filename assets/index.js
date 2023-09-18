const anchorLinks = document.querySelectorAll('a[href*="#"]');
anchorLinks.forEach((link) => {
    link.addEventListener('click', function(event) {
        event.preventDefault();
        const attribute = this.getAttribute('href');
        const target = document.querySelector(attribute);
        if (target) {
            window.scrollTo({
                top: target.offsetTop,
                behavior: 'smooth'
            });
        } else {
            console.error("Cannot resolve anchor " + attribute + " in file " + window.location.pathname);
        }
    });
});

const ipButtons = document.querySelectorAll('button#ip');
ipButtons.forEach((button) => {
    button.addEventListener('click', function() {
        const ip = 'play.whomine.net';

        navigator.clipboard.writeText(ip)
            .then(() => {
                showToast('Айпи скопирован!', 'green');
            })
            .catch((error) => {
                showToast('Айпи не удалось скопировать :(', 'red');
                console.error('Failed to copy the IP, please use a better browser: ', error);
            });
    });
});

function showToast(text, color) {
    const toastsContainer = document.querySelector('.toasts');
    const toast = document.createElement('div');
    toast.classList.add('toast', 'transitionIn', 'transitionOut', color);
    toast.textContent = text;
    toastsContainer.appendChild(toast);

    setTimeout(() => {
        toastsContainer.removeChild(toast);
    }, 3500);
}

document.addEventListener("DOMContentLoaded", () => {
    const arrowLeft = document.getElementById("team-arrow-left");
    const arrowRight = document.getElementById("team-arrow-right");
    const heads = Array.from(document.querySelectorAll(".head"));
    const personalInfoContainers = Array.from(document.querySelectorAll(".personal-info > div"));
    const bodyContainers = Array.from(document.querySelectorAll(".skin > div"));
    const teamContainer = document.getElementById("team");

    let currentIndex = 0;
    let isUpdating = false;
    let intervalId = null;

    function updateSelectedIndex(index, previousIndex) {
        if (isUpdating) return;
        isUpdating = true;

        heads[previousIndex].classList.remove("selected");

        personalInfoContainers[previousIndex].classList.add("fadeText-leave-to", "fadeText-leave-active");
        setTimeout(() => {
            personalInfoContainers[previousIndex].classList.remove("selected", "fadeText-leave-to", "fadeText-leave-active");
        }, 350);

        bodyContainers[previousIndex].classList.add("fadeImg-leave-to", "fadeImg-leave-active");
        setTimeout(() => {
            bodyContainers[previousIndex].classList.remove("selected", "fadeImg-leave-to", "fadeImg-leave-active");
        }, 350);

        heads[index].classList.add("selected");

        personalInfoContainers[index].classList.add("selected", "fadeText-enter-from", "fadeText-enter-active");
        setTimeout(() => {
            personalInfoContainers[index].classList.remove("fadeText-enter-from");
        }, 10);
        setTimeout(() => {
            personalInfoContainers[index].classList.remove("fadeText-enter-active");
            isUpdating = false;
        }, 350);

        bodyContainers[index].classList.add("selected", "fadeImg-enter-from", "fadeImg-enter-active");
        setTimeout(() => {
            bodyContainers[index].classList.remove("fadeImg-enter-from");
        }, 10);
        setTimeout(() => {
            bodyContainers[index].classList.remove("fadeImg-enter-active");
            isUpdating = false;
        }, 350);
    }

    arrowRight.addEventListener("click", () => {
        if (isUpdating) return;
        const previousIndex = currentIndex;
        currentIndex = (currentIndex + 1) % heads.length;
        updateSelectedIndex(currentIndex, previousIndex);
    });

    arrowLeft.addEventListener("click", () => {
        if (isUpdating) return;
        const previousIndex = currentIndex;
        currentIndex = (currentIndex - 1 + heads.length) % heads.length;
        updateSelectedIndex(currentIndex, previousIndex);
    });

    heads.forEach((head) => {
        head.addEventListener("click", function() {
            if (isUpdating) return;
            const headId = this.getAttribute("id");
            const previousIndex = currentIndex;
            const newIndex = heads.findIndex((head) => head.getAttribute("id") === headId);
            if (newIndex !== currentIndex) {
                currentIndex = newIndex;
                updateSelectedIndex(currentIndex, previousIndex);
            }
        });
    });

    function startAutoScroll() {
        intervalId = setInterval(() => {
            const previousIndex = currentIndex;
            currentIndex = (currentIndex + 1) % heads.length;
            updateSelectedIndex(currentIndex, previousIndex);
        }, 5000);
    }

    function stopAutoScroll() {
        clearInterval(intervalId);
    }

    teamContainer.addEventListener("mouseenter", stopAutoScroll);
    teamContainer.addEventListener("mouseleave", startAutoScroll);

    updateSelectedIndex(currentIndex, 1);
    startAutoScroll();
});

const screenshots = [
    '1.webp',
    '2.webp',
    '3.webp',
    '4.webp',
    '5.webp',
    '6.webp',
    '7.webp',
    '8.webp',
    '9.webp',
    '10.webp',
    '11.webp',
    '12.webp',
    '13.webp',
    '14.webp',
    '15.webp',
    '17.webp',
    '18.webp',
    '19.webp',
    '20.webp',
    '22.webp',
    '23.webp',
    '24.webp',
    '25.webp',
    '26.webp',
    '27.webp',
    '28.webp',
    '30.webp'
];

function shuffle(array) {
    for (let i = 0; i < array.length; ++i) {
        const j = Math.floor(Math.random() * array.length);
        [array[i], array[j]] = [array[j], array[i]];
    }
}

let isScreenshotLoading = false;
let screenshotsSeen = 0;

function getRandomScreenshot() {
    if (isScreenshotLoading) return;

    if (screenshotsSeen === screenshots.length) {
        const lastBitch = screenshots[screenshotsSeen];
        shuffle(screenshots);
        screenshotsSeen = 0;
        const thatOne = screenshots.indexOf(lastBitch);
        if (!thatOne) [screenshots[0], screenshots[thatOne]] = [screenshots[thatOne], screenshots[0]];
    }

    const screenshot = screenshots[screenshotsSeen];
    const screenshotImg = document.getElementById('screenshot-img');
    screenshotImg.style.opacity = "0";
    setTimeout(() => {
        screenshotImg.style.backgroundImage = `url(./assets/img/screenshots/${screenshot})`;
    }, 350);
    isScreenshotLoading = true;

    const image = new Image();
    image.src = './assets/img/screenshots/' + screenshot;
    image.onload = function() {
        const brightness = calculateBrightness(image);
        updateButtonColor(brightness);
        setTimeout(() => {
            screenshotImg.classList.add('loaded');
            screenshotImg.style.opacity = "1";
        }, 350);
        setTimeout(() => {
            isScreenshotLoading = false;
        }, 500);
    };
    screenshotsSeen += 1;
}

function calculateBrightness(image) {
    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    const context = canvas.getContext('2d');
    context.drawImage(image, 0, 0);
    return getAverageBrightness(context.getImageData(0, 0, image.width, image.height));
}

function getAverageBrightness(imageData) {
    let brightnessSum = 0;
    const data = imageData.data;
    const pixelCount = data.length / 4;

    for (let i = 0; i < pixelCount; i++) {
        const r = data[i * 4];
        const g = data[i * 4 + 1];
        const b = data[i * 4 + 2];
        const brightnessValue = (r + g + b) / 3;
        brightnessSum += brightnessValue;
    }

    return brightnessSum / pixelCount;
}

function updateButtonColor(brightness) {
    const button = document.getElementById('random-button');
    if (brightness > 128) {
        button.classList.add('dark');
    } else {
        button.classList.remove('dark');
    }
}

document.getElementById('random-button').addEventListener('click', getRandomScreenshot);

getRandomScreenshot();

function isElementInViewport(element, threshold = 125) {
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const windowWidth = window.innerWidth || document.documentElement.clientWidth;
    const topVisible = rect.top + threshold < windowHeight;
    const bottomVisible = rect.bottom - threshold > 0;
    const leftVisible = rect.left + threshold < windowWidth;
    const rightVisible = rect.right - threshold > 0;
    return topVisible && bottomVisible && leftVisible && rightVisible;
}

function handleScroll() {
    const articles = document.querySelectorAll('article');
    for (const article of articles) {
        if (isElementInViewport(article)) {
            article.classList.add('animate');
        }
    }
}

window.addEventListener('scroll', handleScroll);

handleScroll();
