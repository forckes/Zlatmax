//da
import { useDynamicAdapt } from './dynamicAdapt.js';

useDynamicAdapt();
//da

//swiper
const swiper = new Swiper('.main-block__slider', {
    observer: true,
    observerParents:true, 
    slidesPerView: 1,
    spaceBetween: 50,
    direction: 'horizontal',
    loop: false,
    speed: 800,
    allowTouchMove: false,
    pagination: {
        el: '.control-main-block_dots',
        clickable: true,
        type: 'bullets',
    },
    parallax: true,
    autoplay: {
        delay: 5000,
        disableOnInteraction: false,
    },
    // breakpoint: ,
    on: {
        init: function (swiper) {
            const allSlides = document.querySelector('.fraction-control__all')
            const allSlidesItems = document.querySelectorAll('.slide-main-block:not(.swiper-slide-dublicate)'); //allSlidesItems для фікса, щоб показувало без дублікаів
            allSlides.innerHTML = allSlidesItems.length < 10 ? `0${allSlidesItems.length}` : allSlidesItems.length;
        },
        slideChange: function (swiper) {
            const curentSlide = document.querySelector('.fraction-control__current');
            curentSlide.innerHTML = swiper.realIndex + 1 <10 ? `0${swiper.realIndex + 1}` : swiper.realIndex + 1; //realIndex для фікса, щоб показувало правильні індекси і циферки
        }
    }
});
//swiper

//sub-menu
document.addEventListener("click", documentActions);

function documentActions(e) {
    const targetElement = e.target;
    if (targetElement.closest('[data-parent]')) {
        const subMenuId = targetElement.dataset.parent ? targetElement.dataset.parent : null;
        const subMenu = document.querySelector(`[data-submenu="${subMenuId}"]`);
        const catalogMenu = document.querySelector('.catalog-header');
        if (subMenu) {
            catalogMenu.classList.toggle('_sub-menu-show');
            targetElement.classList.toggle('_sub-menu-active');
            subMenu.classList.toggle('_sub-menu-open');
        } else {
            console.log('error')
        }
        e.preventDefault();
    }
    if (targetElement.closest('.menu-top-header__link_catalog')) {
        document.documentElement.classList.add('catalog-open')
        e.preventDefault();
    }
    //back link
    if (targetElement.closest('.menu-catalog__back')) {
        document.documentElement.classList.remove('catalog-open')
        document.querySelector('._sub-menu-active') ? document.querySelector('._sub-menu-active').classList.remove('_sub-menu-active') : null;
        document.querySelector('._sub-menu-open') ? document.querySelector('._sub-menu-open').classList.remove('_sub-menu-open') : null;
        e.preventDefault();
    }
    if (targetElement.closest('.sub-menu-catalog__back')) {
        document.documentElement.classList.remove('_sub-menu-show')
        document.querySelector('._sub-menu-active') ? document.querySelector('._sub-menu-active').classList.remove('_sub-menu-active') : null;
        document.querySelector('._sub-menu-open') ? document.querySelector('._sub-menu-open').classList.remove('_sub-menu-open') : null;
        e.preventDefault();
    }
    //close catalog when we click on burger icon
    if (targetElement.closest('.menu__icon')) {
        document.documentElement.classList.remove('catalog-open')
        e.preventDefault();
    }
    if (targetElement.closest('.menu__icon')) {
        document.documentElement.classList.remove('_sub-menu-show')
        e.preventDefault();
    }
}
//sub-menu

//screen
const isMobile = {
    Android: function () {
        return navigator.userAgent.match(/Andriod/i);
    },
    iOS:function () {
        return navigator.userAgent.match(/Iphone|iPad|iPod/i);
    },
    Opera:function () {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows:function () {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function () {
        return (
            isMobile.Android() ||
            isMobile.iOS() ||
            isMobile.Opera() ||
            isMobile.Windows());
    }
};

if (isMobile.any()) {
    document.body.classList.add('_touch')
} else {
    document.body.classList.add('_pc')
}
//screen

// // burger
const iconMenu = document.querySelector('.menu__icon');
if (iconMenu) {
    const menuBody = document.querySelector('.menu__body');
    iconMenu.addEventListener("click", function(e) {
        document.body.classList.toggle('_lock');
        document.querySelector('.menu__body').classList.toggle('_lock');
        iconMenu.classList.toggle('_active');
        menuBody.classList.toggle('_active');
    });
}
// // burger

//rating
const ratings = document.querySelectorAll('.rating');
if (ratings.length > 0) {
    initRatings();
}
//Основна функція
function initRatings() {
    let ratingActive, ratingValue;
    //Бігаєм по всім рейтінгам на сторінці
    for (let index = 0; index < ratings.length; index++) {
        const rating = ratings[index];
        initRating(rating);
    }
    //Ініціалізуємо конкретний рейтинг 
    function initRating(rating) {
        initRatingVars(rating);

        setRatingActiveWidth();

        if (rating.classList.contains('rating_set')) {
            setRating(rating);
        }
    }
    //Ініціалізуємо перемінні
    function initRatingVars(rating) {
        ratingActive = rating.querySelector('.rating__active');
        ratingValue = rating.querySelector('.rating__value');
    }
    //Ініціалізуємо ширину активних зірок
    function setRatingActiveWidth(index = ratingValue.innerHTML) {
        const RatingActiveWidth = index / 0.05;
        ratingActive.style.width = `${RatingActiveWidth}%`;
    }
    //Ініціалізуємо указатель оцінки
    function setRating(rating) {
        const ratingItems = rating.querySelectorAll(".rating__item");
        for (let index = 0; index < ratingItems.length; index++)  {
            const ratingItem = ratingItems[index];
            ratingItem.addEventListener("mouseenter", function(e) {
                initRatingVars(rating);
                setRatingActiveWidth(ratingItem.value);
            });
            ratingItem.addEventListener("mouseleave", function(e) {
                setRatingActiveWidth();
            });
            ratingItem.addEventListener("click", function (e) {
                initRatingVars(rating); 

                if (rating.dataset.ajax) {
                    setRatingValue(ratingItem.value, rating);
                } else {
                    ratingValue.innerHTML = index + 1;
                    setRatingActiveWidth();
                }
            });
        }
    }
    async function setRatingValue(value, rating) {
        if (!rating.classList.contains('rating_sending')) {
            rating.classList.add('rating_sending');
            //Відправка данних value на сервер
            let response = await fetch('rating.json', {
                method : 'GET',

                //Відправка на реальний сервер(якщо знадобиться)
                // body: JSON.stringify({
                //     userRating: value
                // }),
                // headers : {
                //     'content-type' : 'application/json'
                // }

            });
            if (response.ok) {
                const result = await response.json();

                //Отримуємо новий рейтинг
                const newRating = result.newRating;

                //Виводимо новий середній рейтинг
                ratingValue.innerHTML = newRating;

                //Оновлення актиних зірок
                setRatingActiveWidth();

                rating.classList.remove('rating_sending');
            } else {
                alert("Помилка:(");

                rating.classList.remove('rating_sending');
            }
        }
    }
}
//rating

//catalog-swiper
const Catalogswiper = new Swiper('.products-slider__slider', {
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
    observer: true,
    observerParents:true, 
    slidesPerView: 4,
    spaceBetween: 20,
    slidesPerGroup: 4,
    direction: 'horizontal',
    // loop: true,
    speed: 800,
    allowTouchMove: false,
    dynamicBullets: true,
    pagination: {
        el: '.products-slider__dots',
        clickable: true,
        type: 'bullets',
    },
    autoplay: {
        delay: 5000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,	
    },
    breakpoints: {
        0: {
            slidesPerView: 1,
            slidesPerGroup: 1,
            spaceBetween: 20,
            autoWeight: true,
            pagination: {
                el: '.products-slider__dots',
                type: "fraction",
            },
            speed: 500,
            allowTouchMove: true,
        },
        650: {
            slidesPerView: 2,
            slidesPerGroup: 2,
            pagination: {
                el: '.products-slider__dots',
                clickable: true,
                type: 'bullets',
            },
            speed: 800,
            allowTouchMove: true,
        },
        992: {
            slidesPerView: 3,
            slidesPerGroup: 3,
            spaceBetween: 15,
            pagination: {
                el: '.products-slider__dots',
                clickable: true,
                type: 'bullets',
            },
            speed: 800,
            allowTouchMove: true,
        },
        1350: {
            slidesPerView: 4,
            slidesPerGroup: 4,
            spaceBetween: 20,
            pagination: {
                el: '.products-slider__dots',
                clickable: true,
                type: 'bullets',
            },
            speed: 800,
            allowTouchMove: false,
        },
    }
});
//catalog-swiper

//new-swiper
const Newswiper = new Swiper('.new-products__slider', {
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
    observer: true,
    observerParents:true, 
    slidesPerView: 3,
    spaceBetween: 20,
    slidesPerGroup: 3,
    direction: 'horizontal',
    // loop: true,
    speed: 800,
    allowTouchMove: false,
    pagination: {
        el: '.products-slider__dots',
        clickable: true,
        type: 'bullets',
    },
    autoplay: {
        delay: 5000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,	
    },
    breakpoints: {
        0: {
            slidesPerView: 1,
            slidesPerGroup: 1,
            spaceBetween: 20,
            autoWeight: true,
            pagination: {
                el: '.products-slider__dots',
                type: "fraction",
            },
            speed: 500,
            allowTouchMove: true,
        },
        650: {
            slidesPerView: 2,
            slidesPerGroup: 2,
            pagination: {
                el: '.products-slider__dots',
                clickable: true,
                type: 'bullets',
            },
            speed: 800,
            allowTouchMove: true,
        },
        992: {
            slidesPerView: 3,
            slidesPerGroup: 3,
            spaceBetween: 15,
            pagination: {
                el: '.products-slider__dots',
                clickable: true,
                type: 'bullets',
            },
            speed: 800,
            allowTouchMove: true,
        },
        1080: {
            slidesPerView: 2,
            slidesPerGroup: 2,
            spaceBetween: 15,
            pagination: {
                el: '.products-slider__dots',
                clickable: true,
                type: 'bullets',
            },
            speed: 800,
            allowTouchMove: true,
        },
        1400: {
            slidesPerView: 3,
            slidesPerGroup: 3,
            spaceBetween: 20,
            pagination: {
                el: '.products-slider__dots',
                clickable: true,
                type: 'bullets',
            },
            speed: 800,
            allowTouchMove: false,
        },
    }
});
//new-swiper

//Недороблений складний спойлер
//spoller
const spollersArray = document.querySelectorAll('[data-spollers]');
if (spollersArray.length > 0) {
    //массив звичайних спойлерів
    const spollersRegular = Array.from(spollersArray).filter(function (item, index, self) {
        return !item.dataset.spollers.split(",")[0];
    });
    //ініціалізація звичайних спойлерів
    if (spollersRegular.length > 0) {
        initSpollers(spollersRegular);
    }
    //отримання спойлерів з медіа запитами
    const spollersMedia = Array.from(spollersArray).filter(function (item, index, self) {
        return item.dataset.spollers.split(",")[0];
    });
    //ініціалізація спойлерів з медіа запитами
    if (spollersMedia.length > 0) {
        const breakpointsArray = [];
        spollersMedia.forEach(item => {
            const params = item.dataset.spollers;
            const breakpoint = {};
            const paramsArray = params.split(",");
            breakpoint.value = paramsArray[0];
            breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
            breakpointsArray.push(breakpoint);
        });
        //отримуємо унікальні брекпоїнти
        let mediaQueries = breakpointsArray.map(function (item) {
            return '(' + item.type + "-width: " + item.value + "px)," + item.value + ',' + item.type;
        });
        mediaQueries = mediaQueries.filter(function (item,  index, self) {
            return self.indexOf(item) === index;
        }); 

        //Працюємо з кожним брекпоїнтом
        mediaQueries.forEach(breakpoint => {
            const paramsArray = breakpoint.split(",");
            const mediaBreakpoint = paramsArray[1];
            const mediaType = paramsArray[2];
            const matchMedia = window.matchMedia(paramsArray[0]);

            //обєкти з потрібними вимогами
            const spollersArray = breakpointsArray.filter(function (item) {
                if (item.value === mediaBreakpoint && item.type === mediaType) {
                    return true;
                }
            });
            //подія
            matchMedia.addListener(function () {
                initSpollers(spollersArray, matchMedia);
            });
            initSpollers(spollersArray, matchMedia);
        });
    }  
    //Ініціалізація
     function initSpollers(spollersArray, matchMedia = false) {
        spollersArray.forEach(spollersBlock => {
            spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
            if (matchMedia.matches || !matchMedia) {
                spollersBlock.classList.add('_init');
                initSpollerBody(spollersBlock);
                spollersBlock.addEventListener("click", setSpollerAction);
            } else {
                spollersBlock.classList.remove('_init');
                initSpollersBody(spollersBlock, false);
                spollersBlock.removeEventListener("click", setSpollerAction);
            }
        });
    }
    //Роботаз контентом
    function initSpollerBody(spollersBlock, hideSpollerBlock = true) {
        const spollerTitles = spollerBlock.querySelectorAll('[data-spoller]');
        if (spollerTitles.length > 0) {
            spollerTitles.forEach(spollerTitle => {
                if (hideSpollerBody) {
                    spollerTitle.removeAttribute('tabindex');
                    if (!spollerTitle.classList.contains('_active')) {
                        spollerTitle.nextElementSibling.hidden = true;
                    }
                } else {
                    spollerTitle.setAttribute('tabindex', '-1');
                    spollerTitle.nextElementSibling.hidden = false;
                }  
            });
        }
    }
}
//spoller
//Недороблений складний спойлер