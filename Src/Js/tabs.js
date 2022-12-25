//..

const tabNavItems = document.querySelectorAll('.info-product__title')
const tabItems = document.querySelectorAll('.info-product__body')
document.addEventListener("click", function (e) {
    const targetElement = e.target;
    let newActiveIndex = null;
    let currentActiveIndex = null;
    if (targetElement.closest(".info-product__title")) {
        tabNavItems.forEach((tabNavItem, index) => {
            if(tabNavItem.classList.contains('_tab-active')){
                currentActiveIndex = index;
                tabNavItem.classList.remove('_tab-active')
            }
            if(tabNavItem === targetElement){
                newActiveIndex = index;
            }
        });
        targetElement.classList.add('_tab-active');
        tabItems[currentActiveIndex].classList.remove('_tab-active');
        tabItems[newActiveIndex].classList.add('_tab-active');
    }
});
