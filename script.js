const MAX_VALUE = 1000000000000000n;

const kanjiDigits = ["", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
const romajiDigits = ["", "ichi", "ni", "san", "yon", "go", "roku", "nana", "hachi", "kyuu"];

const hundredsKanji = ["", "百", "二百", "三百", "四百", "五百", "六百", "七百", "八百", "九百"];
const hundredsRomaji = ["", "hyaku", "ni-hyaku", "san-byaku", "yon-hyaku", "go-hyaku", "roppyaku", "nana-hyaku", "happyaku", "kyuu-hyaku"];

const thousandsKanji = ["", "千", "二千", "三千", "四千", "五千", "六千", "七千", "八千", "九千"];
const thousandsRomaji = ["", "sen", "ni-sen", "san-zen", "yon-sen", "go-sen", "roku-sen", "nana-sen", "hassen", "kyuu-sen"];

const tensKanji = ["", "十", "二十", "三十", "四十", "五十", "六十", "七十", "八十", "九十"];
const tensRomaji = ["", "juu", "ni-juu", "san-juu", "yon-juu", "go-juu", "roku-juu", "nana-juu", "hachi-juu", "kyuu-juu"];

const majorUnitsKanji = ["", "万", "億", "兆"];
const majorUnitsRomaji = ["", "man", "oku", "choo"];

const onesWords = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
const teensWords = ["ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
const tensWords = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
const shortScaleWords = ["", "thousand", "million", "billion", "trillion", "quadrillion", "quintillion"];

const numInput = document.getElementById('numInput');
const numSlider = document.getElementById('numSlider');
const kanjiOut = document.getElementById('kanjiOut');
const romajiOut = document.getElementById('romajiOut');
const westernDigits = document.getElementById('westernDigits');
const westernWords = document.getElementById('westernWords');
const resultCard = document.getElementById('resultCard');

numInput.addEventListener('input', (e) => {
    const cleaned = e.target.value.replace(/[^0-9]/g, '');
    if (cleaned === "") {
        e.target.value = "";
        numSlider.value = 0;
        processNumber("");
        return;
    }

    let num = BigInt(cleaned);
    if (num > MAX_VALUE) {
        num = MAX_VALUE;
    }

    const formatted = formatWithCommas(num);
    e.target.value = formatted;
    numSlider.value = Number(num);
    processNumber(num.toString());
});

numSlider.addEventListener('input', (e) => {
    const num = BigInt(e.target.value);
    numInput.value = formatWithCommas(num);
    processNumber(num.toString());
});

function formatWithCommas(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function processNumber(rawVal) {
    if (!rawVal || rawVal === "") {
        kanjiOut.innerText = "-";
        romajiOut.innerText = "-";
        westernDigits.innerText = "-";
        westernWords.innerText = "-";
        return;
    }

    const num = BigInt(rawVal);
    westernDigits.innerText = formatWithCommas(num);
    westernWords.innerText = convertToEnglishWords(num);

    const { kanji, romaji } = convertToJapanese(num);

    kanjiOut.innerText = kanji;
    romajiOut.innerText = romaji;

    resultCard.classList.remove('animate-pop');
    void resultCard.offsetWidth;
    resultCard.classList.add('animate-pop');
}

function convertChunkToWords(n) {
    const parts = [];
    const hundreds = Math.floor(n / 100);
    const remainder = n % 100;

    if (hundreds > 0) {
        parts.push(`${onesWords[hundreds]} hundred`);
    }

    if (remainder > 0) {
        let remText = "";
        if (remainder < 10) {
            remText = onesWords[remainder];
        } else if (remainder < 20) {
            remText = teensWords[remainder - 10];
        } else {
            const ten = Math.floor(remainder / 10);
            const one = remainder % 10;
            remText = tensWords[ten] + (one > 0 ? `-${onesWords[one]}` : "");
        }

        if (parts.length > 0) {
            parts.push(`and ${remText}`);
        } else {
            parts.push(remText);
        }
    }

    return parts.join(" ");
}

function convertToEnglishWords(num) {
    if (num === 0n) return "zero";

    let temp = num;
    const groups = [];

    while (temp > 0n) {
        groups.push(Number(temp % 1000n));
        temp = temp / 1000n;
    }

    const sections = [];
    for (let i = groups.length - 1; i >= 0; i--) {
        const g = groups[i];
        if (g === 0) continue;

        const chunkText = convertChunkToWords(g);
        const scale = shortScaleWords[i];
        sections.push(scale ? `${chunkText} ${scale}` : chunkText);
    }

    if (sections.length >= 2) {
        const last = sections[sections.length - 1];
        if (!last.includes(" and ") && groups[0] > 0 && groups[0] < 100) {
            sections[sections.length - 1] = `and ${last}`;
        }
    }

    return sections.join(", ");
}

function convertToJapanese(num) {
    if (num === 0n) return { kanji: "零", romaji: "rei" };

    let temp = num;
    let chunks = [];

    while (temp > 0n) {
        chunks.push(temp % 10000n);
        temp = temp / 10000n;
    }

    let resultKanji = "";
    let resultRomaji = "";

    for (let i = chunks.length - 1; i >= 0; i--) {
        let chunk = chunks[i];
        if (chunk === 0n) continue;

        let c = Number(chunk);
        let k = "";
        let r = [];

        let thou = Math.floor(c / 1000);
        let hund = Math.floor((c % 1000) / 100);
        let ten = Math.floor((c % 100) / 10);
        let one = c % 10;

        if (thou > 0) {
            k += thousandsKanji[thou];
            let tRom = thousandsRomaji[thou];
            if (i > 0 && thou === 1) {
                tRom = "issen";
            }
            r.push(tRom);
        }
        if (hund > 0) { k += hundredsKanji[hund]; r.push(hundredsRomaji[hund]); }
        if (ten > 0) { k += tensKanji[ten]; r.push(tensRomaji[ten]); }

        if (one > 0) {
            k += kanjiDigits[one];
            r.push(romajiDigits[one]);
        }

        if (i > 0) {
            const unitIdx = Math.min(i, majorUnitsKanji.length - 1);
            k += majorUnitsKanji[unitIdx];
            let unitRom = majorUnitsRomaji[unitIdx];
            if (c === 1) {
                if (unitIdx === 3) {
                    r = ["icchoo"];
                } else {
                    r = ["ichi-" + unitRom];
                }
            } else {
                let lastIdx = r.length - 1;
                if (unitIdx === 3 && r[lastIdx] === "juu") {
                    r[lastIdx] = "jucchoo";
                } else {
                    r.push(unitRom);
                }
            }
        }

        resultKanji += k;
        resultRomaji += (resultRomaji ? " " : "") + r.join("-");
    }

    resultRomaji = resultRomaji
        .replace(/-man/g, ' man')
        .replace(/-oku/g, ' oku')
        .replace(/-choo/g, ' choo');

    return {
        kanji: resultKanji,
        romaji: resultRomaji.trim()
    };
}

processNumber(numInput.value.replace(/[^0-9]/g, ''));