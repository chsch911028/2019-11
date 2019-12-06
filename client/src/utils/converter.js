export const dateDiff2Str = (date) => {
    let diff = Date.now() - date

    const y = Math.floor(diff / 1000 / 60 / 60 / 24 / 365)
    diff -= y * 1000 * 60 * 60 * 24 * 365

    const M = Math.floor(diff / 1000 / 60 / 60 / 24 / 31)
    diff -= M * 1000 * 60 * 60 * 24 * 30

    const d = Math.floor(diff / 1000 / 60 / 60 / 24)
    diff -= d * 1000 * 60 * 60 * 24

    const h = Math.floor(diff / 1000 / 60 / 60);
    diff -= h * 1000 * 60 * 60

    const m = Math.floor(diff / 1000 / 60)
    diff -= m * 1000 * 60

    const s = Math.floor(diff / 1000)

    if (y) return `${y} 년 전`
    if (M) return `${M} 개월 전`
    if (d) return `${d} 일 전`
    if (h) return `${h} 시간 전`
    if (m) return `${m} 분 전`
    if (s) return `${s} 초 전`

    return "방금 전"
}

export const base642Blob = (base64) => {
    const byteString = window.atob(base64);

    // write the bytes of the string to an ArrayBuffer
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++)
        ia[i] = byteString.charCodeAt(i);


    // write the ArrayBuffer to a blob, and you're done
    const bb = new Blob([ab]);
    return bb;
}

export default { dateDiff2Str, base642Blob }