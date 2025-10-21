export default {
    mounted(el) {
        el.addEventListener('click', () => {
            el.querySelector('svg')?.animate(
                { transform: `rotate(180deg)` },
                { duration: 500, easing: "ease-out" }
            )
        })
    }
}