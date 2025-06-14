export default {
    // 文字复制剪贴
    updated(el, { value, arg, instance }) {
        el.addEventListener('click', async () => {
            if (navigator.clipboard) {
                await navigator.clipboard.writeText(value)
            } else {
                const tempTextarea = document.createElement('textarea')
                tempTextarea.value = props.code
                document.body.appendChild(tempTextarea)
                tempTextarea.select()
                document.execCommand('copy')
                document.body.removeChild(tempTextarea)
            }
            instance.$modal.message({
                message: instance.$t('message.copied'),
                type: arg || 'success'
            })
        })
    }
}