const kanjiDigits = ["", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
const romajiDigits = ["", "ichi", "ni", "san", "yon", "go", "roku", "nana", "hachi", "kyuu"];

const hundredsKanji = ["", "百", "二百", "三百", "四百", "五百", "六百", "七百", "八百", "九百"];
const hundredsRomaji = ["", "hyaku", "ni-hyaku", "san-byaku", "yon-hyaku", "go-hyaku", "roppyaku", "nana-hyaku", "happyaku", "kyuu-hyaku"];

const thousandsKanji = ["", "千", "二千", "三千", "四千", "五千", "六千", "七千", "八千", "九千"];
const thousandsRomaji = ["", "sen", "ni-sen", "san-zen", "yon-sen", "go-sen", "roku-sen", "nana-sen", "hassen", "kyuu-sen"];

const tensKanji = ["", "十", "二十", "三十", "四十", "五十", "六十", "七十", "八十", "九十"];
const tensRomaji = ["", "juu", "ni-juu", "san-juu", "yon-juu", "go-juu", "roku-juu", "nana-juu", "hachi-juu", "kyuu-juu"];

const majorUnitsKanji = ["", "万", "億", "兆"];
const majorUnitsRomaji = ["", "man", "oku", "chou"];

const numInput = document.getElementById('numInput');
const numSlider = document.getElementById('numSlider');
const kanjiOut = document.getElementById('kanjiOut');
const romajiOut = document.getElementById('romajiOut');
const westernDigits = document.getElementById('westernDigits');
const resultCard = document.getElementById('resultCard');

numInput.addEventListener('input', (e) => {
    let val = e.target.value;
    if (val > 1000000000000) { val = 1000000000000; e.target.value = val; }
    numSlider.value = val || 0;
    processNumber(val);
});

numSlider.addEventListener('input', (e) => {
    numInput.value = e.target.value;
    processNumber(e.target.value);
});

function processNumber(rawVal) {
    if (!rawVal || rawVal === "") {
        kanjiOut.innerText = "-";
        romajiOut.innerText = "-";
        westernDigits.innerText = "-";
        return;
    }

    const num = BigInt(rawVal);
    westernDigits.innerText = new Intl.NumberFormat('en-US').format(num);

    const { kanji, romaji } = convertToJapanese(num);
    
    kanjiOut.innerText = kanji;
    romajiOut.innerText = romaji;

    resultCard.classList.remove('animate-pop');
    void resultCard.offsetWidth;
    resultCard.classList.add('animate-pop');
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

        if (thou > 0) { k += thousandsKanji[thou]; r.push(thousandsRomaji[thou]); }
        if (hund > 0) { k += hundredsKanji[hund]; r.push(hundredsRomaji[hund]); }
        if (ten > 0) { k += tensKanji[ten]; r.push(tensRomaji[ten]); }
        
        if (one > 0) {
            k += kanjiDigits[one]; 
            r.push(romajiDigits[one]);
        }

        if (i > 0) {
            if (c === 1) {
                k = "一";
                r = ["ichi"];
            }
            k += majorUnitsKanji[i-1];
            r.push(majorUnitsRomaji[i-1]);
        }

        resultKanji += k;
        resultRomaji += (resultRomaji ? " " : "") + r.join("-");
    }

    resultRomaji = resultRomaji.replace(/-man/g, ' man').replace(/-oku/g, ' oku').replace(/-chou/g, ' chou');

    return {
        kanji: resultKanji,
        romaji: resultRomaji.trim()
    };
}

processNumber(numInput.value);