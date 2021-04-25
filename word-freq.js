/**
 * This illustrates using a JavaScript functional pipeline to calculate word frequencies found in
 * a text document. An array prototype reduce function processes a list of functions, each taking the
 * reducer accumulator value as its single argument. The first item in the pipeline is the initial
 * argument: the name of an input text file. It becomes the initial accumulated value.
 * @type {module:fs}
 */
const fs = require('fs');
const INPUT_TEXT = 'text.txt';
const STOP_WORDS = 'stopwords.txt';

function readText(fileName) {
    return fs.readFileSync(fileName, 'utf8');
}
function parseWords(words) {
    const wordList = [];
    let index = 0;
    let word = "";
    while (index < words.length) {
        const c = words[index].toLowerCase();
        if (c >= "a" && c <= "z") {
            word += c;
            index++;
            continue;
        }
        index++;
        if (word !== "") {
            wordList.push(word);
        }
        word = "";
    }
    return wordList;
}
function removeStopwords(wordList) {
    const stopWordsRaw = fs.readFileSync(STOP_WORDS, "utf-8");
    const stopWordsText = stopWordsRaw.replace(/(\r\n|\n|\r)/gm, ",");
    const stopWords = stopWordsText.split(",");
    for (let i = 0; i < wordList.length; i++) {
        for (let j = 0; j < stopWords.length; j++) {
            if (wordList[i] === stopWords[j]) {
                for (let k = i; k < wordList.length-1; k++) {
                    wordList[k] = wordList[k+1];
                }
                i--; // this handles two stopwords in a row
                wordList.pop();
                break;
            }
        }
    }
    return wordList;
}
function calculateFreqs(wordList) {
    const wordFreqs = [];
    wordFreqs.push([wordList[0],1]);
    for (let i = 1; i < wordList.length; i++) {
        for (let j = 0; j < wordFreqs.length; j++) {
            if (wordList[i] === wordFreqs[j][0]) {
                wordFreqs[j][1] += 1;
                break;
            }
        }
        wordFreqs.push([wordList[i], 1]);
    }
    return wordFreqs;
}
function sortFreqs(wordFreqs) {
    for (let i = wordFreqs.length-1; i > 0; i--) {
        for (let j = 0; j < i; j++) {
            if (wordFreqs[j][1] < wordFreqs[j+1][1]) {
                const temp = wordFreqs[j];
                wordFreqs[j] = wordFreqs[j+1];
                wordFreqs[j+1] = temp;
            }
        }
    }
    return wordFreqs;
}
function getTopFreqs(wordFreqs) {
    let str = "";
    for (let i = 0; i < 20; i++) {
        str += wordFreqs[i][0] + ": " + wordFreqs[i][1] + "\n";
    }
    return str;
}
function display(wordFreqs) {
    console.log(wordFreqs);
}

const pipeline = [ INPUT_TEXT,
    readText,
    parseWords,
    removeStopwords,
    calculateFreqs,
    sortFreqs,
    getTopFreqs,
    display ];
pipeline.reduce((acc, fn) => fn(acc));
