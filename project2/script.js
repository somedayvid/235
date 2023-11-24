
let mainKanjiArray = [];
let mainVocabArray = [];
let mainRadicalsArray = [];
let minInclusive = 0;
let maxInclusive = 60;
let term = "";
const requestHeaders =
new Headers({
  Authorization: 'Bearer ' +  ' 89abe689-ce3d-4035-acfd-65d442782f72 ',
});

//local storage variables
const prefix = "dg8516-";
const searchTermKey = prefix + "term";
const wordTypeKey = prefix + "type";
const searchByKey = prefix + "searchBy";

const storedTerm = localStorage.getItem(searchTermKey);
const storedType = localStorage.getItem(wordTypeKey);
const storedSearchBy = localStorage.getItem(searchByKey);

window.onload = () => {
  const searchWindow = document.querySelector("#searchterm");
  const typeSelector = document.querySelector("#type");
  const searchBySelector = document.querySelector("#searchby");

  //attaches const to actions the user can take
  document.querySelector("#search").onclick = searchButtonClicked;


  showHomeInfo();
  document.querySelector("#title").onclick = showHomeInfo;
  searchWindow.onchange = storeAll;
  typeSelector.onchange = storeAll;
  searchBySelector.onchange = storeAll;

  //checks and puts stored terms into each interactible item
  if(storedTerm){
    searchWindow.value = storedTerm;
  }
  else{
    searchWindow.value = "summer";
  }
  if(storedType){
    typeSelector.value = storedType;
  }
  else{
    typeSelector.value = "radical";
  }
  if(storedSearchBy){
    searchBySelector.value = storedSearchBy;
  }
  else{
    searchBySelector.value = "level";
  }

  //gets all api information for japanese writing systems
  allVocab();
  allKanji();
  allRadicals();
};

function storeAll(){
  localStorage.setItem(searchTermKey, document.querySelector("#searchterm").value);
  localStorage.setItem(wordTypeKey, document.querySelector("#type").value);
  localStorage.setItem(searchByKey, document.querySelector("#searchby").value);
}

function showHomeInfo(){
  document.querySelector("#extraInfo").innerHTML = `<h2>How does the Japanese Language Work?</h2>
  <p>In very simplified terms Japanese has three core written language systems: 
      <a href="https://simple.wikipedia.org/wiki/Katakana" target="_blank" rel="noopener">katakana</a>,
      <a href="https://simple.wikipedia.org/wiki/Hiragana" target="_blank" rel="noopener">hiragana</a>, and 
      <a href="https://simple.wikipedia.org/wiki/Kanji" target="_blank" rel="noopener">kanji</a>.
      Hiragana and katakana have phoentic sounds that are associated with each symbol. Kanji can be represented using hiragana
      though it is typically represented with symbols, similar to Chinese wherein each symbol has a meaning.
  </p>
  <h2>What are levels?</h2>
  <p>The Wanikani site sorts all their radicals, kanji, and vocabulary into levels, seperated again into blocks of 10.
      The site is intended as a learning platform of the Japanese writing systems so the levels are there as a sort of
      indicator as to the user's progress. Learning Japanese, and many other skills, is described as easy at the beginning
      before the difficulty ramps up and gets really complicated, until everything clicks and the rest feels natural to you.
      As such the beginning level is labled as "Pleasant" the middle levels are "Painful", "Death", and "Hell", and the 
      final levels are described as "Paradise" and "Reality". In general as the levels increase the radicals, kanji, and 
      vocabulary of each level get less commonly used in everyday language and more complex.
  </p>`;
  document.querySelector("#numresults").innerHTML = "";
  document.querySelector("#display").innerHTML = "";
} 

//gets the button restrictions and passes them into the data accessor
function searchButtonClicked(){
  let searchType = document.querySelector("#type").value;
  term = document.querySelector("#searchterm").value;
  
  document.querySelector("#numresults").innerHTML = `Searching for definitions that match "${term}"`;

  //changes the locally stored terms and options to the new ones selected

  switch(document.querySelector("#searchby").value){
    case "def":
      switch(searchType){
        case "radical":
          getThings(mainRadicalsArray, searchType);
          break;
        case "vocabulary":
          getThings(mainVocabArray, searchType);
          break;
        case "kanji":
          getThings(mainKanjiArray, searchType);
          break;
      }
      break;
    case "level":
      switch(searchType){
        case "radical":
          accessByLevel(mainRadicalsArray, searchType);
          break;
        case "vocabulary":
          accessByLevel(mainVocabArray, searchType);
          break;
        case "kanji":
          accessByLevel(mainKanjiArray, searchType);
          break;
      }
      break;
  }
}

//unfortunately was unable to avoid DRY with this one even after working on it for several hours
//gets all radicals from api
function allRadicals(){
  const apiEndpoint =
    new Request('https://api.wanikani.com/v2/subjects?types=radical', {
      method: 'GET',
      headers: requestHeaders
    });
  fetch(apiEndpoint)
    .then(response => response.json())
    .then(responseBody => {
      mainRadicalsArray = responseBody.data.slice(0);
    }
  );
}
//gets all the kanji from the api
function allKanji(){
  const apiEndpoint =
    new Request('https://api.wanikani.com/v2/subjects?types=kanji', {
      method: 'GET',
      headers: requestHeaders
    });
  fetch(apiEndpoint)
    .then(response => response.json())
    .then(responseBody => {
      mainKanjiArray = responseBody.data.slice(0);
      repeatingKanji(responseBody.pages.next_url);
    }
  );
}
function repeatingKanji(nextURL){
  if(nextURL != null){
    const apiEndpoint =
    new Request(nextURL, {
      method: 'GET',
      headers: requestHeaders
    });
    fetch(apiEndpoint)
      .then(response => response.json())
      .then(responseBody => { 
        const tempArray = mainKanjiArray;
        mainKanjiArray = tempArray.concat(responseBody.data);
        nextURL = responseBody.pages.next_url;
        repeating(responseBody.pages.next_url);
    });
  }
}
//gets all the vocabulary from the api
function allVocab(){
  const apiEndpoint =
    new Request('https://api.wanikani.com/v2/subjects?types=vocabulary', {
      method: 'GET',
      headers: requestHeaders
    });
  fetch(apiEndpoint)
    .then(response => response.json())
    .then(responseBody => {
      mainVocabArray = responseBody.data.slice(0);
      repeating(responseBody.pages.next_url);
    }
  );
}
function repeating(nextURL){
  if(nextURL != null){
    const apiEndpoint =
    new Request(nextURL, {
      method: 'GET',
      headers: requestHeaders
    });
    fetch(apiEndpoint)
      .then(response => response.json())
      .then(responseBody => { 
        const tempArray = mainVocabArray;
        mainVocabArray = tempArray.concat(responseBody.data);
        nextURL = responseBody.pages.next_url;
        repeating(responseBody.pages.next_url);
    });
  }
}

// function accessRadicalsByLevel(){
//   let results = [];
//   let bigString = "";
//   for(let i = 0; i < mainRadicalsArray.length; i++){
//     if(mainRadicalsArray[i].data.level == term.trim()){
//       results.push(mainRadicalsArray[i]);
//     }
//   }
//   console.log(mainRadicalsArray);
//   document.querySelector("#numresults").innerHTML = `<p>${results.length} result(s) for "${term}"</p>`;
//   document.querySelector("#display").innerHTML = getRadicalInfo(results, bigString);
// }

function accessByLevel(array, type){
  let results = [];
  let bigString = "";

  for(let i = 0; i< array.length;i++){
    if(array[i].data.level == term.trim()){
      results.push(array[i]);
    }
  }
  console.log("hi");
  document.querySelector("#numresults").innerHTML = `<p>${results.length} result(s) for level ${term} ${type}</p>`;
  document.querySelector("#display").innerHTML = getReadings(results, bigString, type);
}

// function accessKanjiByLevel(){
//   let results = [];
//   let bigString = "";

//   for(let i = 0; i < mainKanjiArray.length;i++){
//       if(mainKanjiArray[i].data.level == term){
//         results.push(mainKanjiArray[i]);
//     }
//   }

//   document.querySelector("#numresults").innerHTML = `<p>${results.length} result(s) for level ${term} 
//   ${document.querySelector("#type").value}</p>`;
//   document.querySelector("#display").innerHTML = getKanjiReadings(results, bigString);
// }

// function accessVocabByLevel(){
//   let results = [];
//   let bigString = "";

//   for(let i = 0; i< mainVocabArray.length;i++){
//     if(mainVocabArray[i].data.level == term.trim()){
//       results.push(mainVocabArray[i]);
//     }
//   }
//   document.querySelector("#numresults").innerHTML = `<p>${results.length} result(s) for "${term}"</p>`;
//   document.querySelector("#display").innerHTML = getVocabReadings(results, bigString);
// }
function getReadings(results, bigString, type){
switch(type){
  case "radical":
    for(let i = 0; i < results.length;i++)
    {
      bigString += displayRadicalResults(results, i);
    }
    return bigString;
  case "kanji":
    for(let z = 0; z < results.length;z++){
      let meaningsString = "";
  
      //loops through the meanings data and adds the data to a meanings string
      let meaningsArray = results[z].data.meanings;
      for(let j = 0; j < meaningsArray.length;j++){
        meaningsString += meaningsArray[j].meaning;
        if(meaningsArray.length > j + 1){
          meaningsString += ", ";
        }
      }
  
    let readingsArray = results[z].data.readings;
  
    let OnString = "";
    let KunString = "";
  
    //can get both readings by looping through the arrays 
    for(let h = 0; h < readingsArray.length;h++){
      if(readingsArray[h].type == "onyomi"){
        OnString += readingsArray[h].reading;
        //checks each reading for if the type is onyomi and the next reading in the array as well
        //then adds them to the onyomi string
        if(h + 1 < readingsArray.length && readingsArray[h + 1].type == "onyomi"){
          OnString += ", ";
        }
      }
      //same process for kunyomi as the onyomi readings
      else if(readingsArray[h].type == "kunyomi"){
        KunString += readingsArray[h].reading;
        if(h + 1 < readingsArray.length && readingsArray[h + 1].type == "kunyomi"){
          KunString += ", ";
        }
      }
    }
    if(OnString == ""){
      OnString = "None";
    }
    if(KunString == ""){
      KunString = "None";
    }
      bigString += displayKanjiResults(results, z, OnString, KunString, meaningsString);
    }
    return bigString;
  case "vocabulary":
    for(let z = 0; z < results.length;z++){
      meaningsString = "";
      readingsString = "";
  
      //loops through the meanings data and adds the data to a meanings string
      meaningsArray = results[z].data.meanings;
      for(let j = 0; j < meaningsArray.length;j++){
        meaningsString += meaningsArray[j].meaning;
        if(meaningsArray.length > j + 1){
          meaningsString += ", ";
        }
      }
  
      //if the type specifically is vocabulary then there is only one reading
        readingsArray = results[z].data.readings;
        for(let j = 0; j < readingsArray.length;j++){
          readingsString += readingsArray[j].reading;
          if(readingsArray.length > j + 1){
            readingsString += ", ";
        }
      }
      bigString += displayVocabResults(results, z, readingsString, meaningsString);
    }
    return bigString;
}
}
// function getRadicalInfo(results, bigString){
//   for(let i = 0; i < results.length;i++)
//   {
//     bigString += displayRadicalResults(results, i);
//   }
//   return bigString;
// }
// function getKanjiReadings(results, bigString){
//   for(let z = 0; z < results.length;z++){
//     let meaningsString = "";

//     //loops through the meanings data and adds the data to a meanings string
//     let meaningsArray = results[z].data.meanings;
//     for(let j = 0; j < meaningsArray.length;j++){
//       meaningsString += meaningsArray[j].meaning;
//       if(meaningsArray.length > j + 1){
//         meaningsString += ", ";
//       }
//     }

//   let readingsArray = results[z].data.readings;

//   let OnString = "";
//   let KunString = "";

//   //can get both readings by looping through the arrays 
//   for(let h = 0; h < readingsArray.length;h++){
//     if(readingsArray[h].type == "onyomi"){
//       OnString += readingsArray[h].reading;
//       //checks each reading for if the type is onyomi and the next reading in the array as well
//       //then adds them to the onyomi string
//       if(h + 1 < readingsArray.length && readingsArray[h + 1].type == "onyomi"){
//         OnString += ", ";
//       }
//     }
//     //same process for kunyomi as the onyomi readings
//     else if(readingsArray[h].type == "kunyomi"){
//       KunString += readingsArray[h].reading;
//       if(h + 1 < readingsArray.length && readingsArray[h + 1].type == "kunyomi"){
//         KunString += ", ";
//       }
//     }
//   }
//   if(OnString == ""){
//     OnString = "None";
//   }
//   if(KunString == ""){
//     KunString = "None";
//   }
//     bigString += displayKanjiResults(results, z, OnString, KunString, meaningsString);
//   }
//   return bigString;
// }
// function getVocabReadings(results, bigString){
//   for(let z = 0; z < results.length;z++){
//     meaningsString = "";
//     readingsString = "";

//     //loops through the meanings data and adds the data to a meanings string
//     meaningsArray = results[z].data.meanings;
//     for(let j = 0; j < meaningsArray.length;j++){
//       meaningsString += meaningsArray[j].meaning;
//       if(meaningsArray.length > j + 1){
//         meaningsString += ", ";
//       }
//     }

//     //if the type specifically is vocabulary then there is only one reading
//       readingsArray = results[z].data.readings;
//       for(let j = 0; j < readingsArray.length;j++){
//         readingsString += readingsArray[j].reading;
//         if(readingsArray.length > j + 1){
//           readingsString += ", ";
//       }
//     }
//     bigString += displayVocabResults(results, z, readingsString, meaningsString);
//   }
//   console.log(bigString);
//   return bigString;
// }

function displayRadicalResults(resultsArray, index){
  return `<div class ='result'>
  <p id="identifier">Identifier: ${resultsArray[index].data.meanings[0].meaning}</p>
  <p id="character">Character: ${resultsArray[index].data.characters}</p>
  <p id="level">Level: ${resultsArray[index].data.level}</p>
  </div>`;
}

function displayKanjiResults(resultsArray, index, onyomis, kunyomis, meanings){
  return `<div class ='result'>
      <p id="meanings">Meanings: ${meanings}</p>
      <p id="onyomi">Onyomi: ${onyomis}</p>
      <p id="kunyomi">Kunyomi: ${kunyomis}</p>
      <p id="slug">Kanji: ${resultsArray[index].data.characters}</p>
      <p id="level">Level: ${resultsArray[index].data.level}</p>
    </div>`;
}

function displayVocabResults(resultsArray, index, readings, meanings){
  return `<div class ='result'>
                <p id="meanings">Meanings: ${meanings}</p>
                <p id="readings">Kana: ${readings}</p>
                <p id="slug">Kanji: ${resultsArray[index].data.characters}</p>
                <p id="level">Level: ${resultsArray[index].data.level}</p>
              </div>`;
}

function getThings(array, type){
  let results = [];
  const capitalizedTerm = capitalizeEachWord(term);
  if(term == ""){
    document.querySelector("#numresults").innerHTML = `Please input a search term!`;
  }
  else{
  //first checks if the user input term will net any results
  for(let i = 0; i < array.length;i++){
    for(let k = 0; k < array[i].data.meanings.length;k++){
      if(array[i].data.meanings[k].meaning == capitalizedTerm){
        results.push(array[i]);
      }
    }
  }
  //if not then returns nothing and displays that there were no results
  if(results.length <= 0){
    document.querySelector("#numresults").innerHTML = `No results found for "${term}"`;
    document.querySelector("#display").innerHTML = "";
  }
  //if yes! then we call another function, this time with the results we found and pass through the type again
  else getTerm(results, type);
  }
}

function getTerm(results,type){
let meaningsArray = [];
let readingsArray = [];
let readingsString = "";
let meaningsString = "";
let bigString = "";
let line = "";
let epicestString = "";

//radicals have different content than vocabulary and kanji so we check the type first
//vocabulary and kanji both have meanings and readings so we can check for meanings in both first
if(type != "radical"){
  for(let z = 0; z < results.length;z++){
    meaningsString = "";
    readingsString = "";

    //loops through the meanings data and adds the data to a meanings string
    meaningsArray = results[z].data.meanings;
    for(let j = 0; j < meaningsArray.length;j++){
      meaningsString += meaningsArray[j].meaning;
      if(meaningsArray.length > j + 1){
        meaningsString += ", ";
      }
    }

    //if the type specifically is vocabulary then there is only one reading
    if(type == "vocabulary")
    {
      readingsArray = results[z].data.readings;
      for(let j = 0; j < readingsArray.length;j++){
        readingsString += readingsArray[j].reading;
        if(readingsArray.length > j + 1){
          readingsString += ", ";
        }
      }

      line = `<div class ='result'>
                    <p id="meanings">Meanings: ${meaningsString}</p>
                    <p id="readings">Kana: ${readingsString}</p>
                    <p id="slug">Kanji: ${results[z].data.characters}</p>
                    <p id="level">Level: ${results[z].data.level}</p>
                  </div>`;
    }
    //if the type is specifically kanji then there are additional readings 
    //like onyomi and kunyomi to account for 
    else if(type == "kanji")
    {
    epicestString = getKanjiReadings(results, bigString);
  }
}
}
//goes here if the type is a radical
else
{
  for(let i = 0; i < results.length;i++)
  {
    if(results[i].data.slug == lowercaseFirstLetter(term))
    {
      line = `<div class ='result'>
                    <p id="identifier">Identifier: ${results[i].data.slug}</p>
                    <p id="character">Character: ${results[i].data.characters}</p>
                    <p id="level">Level: ${results[i].data.level}</p>
                  </div>`;
    }
  }
  bigString += line;
}

document.querySelector("#numresults").innerHTML = `<p>${results.length} result(s) for "${term}"</p>`;
document.querySelector("#display").innerHTML = epicestString;
}

//three remaining functions are all little sections for possible FAQs for each type in Japanese
function explainRadicals(){
  document.querySelector("#extraInfo").innerHTML = `<h2>What are radicals?</h2>
  <p>Radicals technically do not have definitions, but written Japanese characters, aka kanji, are made up of individual radicals and
      since kanji is relatively difficult to memorize, radicals, the building blocks of kanji, can clue you into the kanji's definition.
      Radical definitions can be pretty random. Try out words relating to direction, body parts, or adjectives.
  </p>
  <h2>Why are there so few results?</h2>
  <p>Wanikani has given each radical a unique definition. Overlapping radical definitions would defeat the point of the definitions
      as they are there to help you memorize what each component of the kanji means to build up to a potential definition and assist 
      your ability to identify each kanji.
  </p>
  <h2>How do they decide what definitions radicals have?</h2>
  <p>For simpler and recognizable radicals the definitions tend to just be a cross between something the radical resembles in real life
   and the kanji that it is used in. If the radical's definition is of an abstract concept then the definition is probably made 
   with greater emphasis on the kanji characters it appears in. A common technique for memorizing radicals is using mnemonics 
   which tends to be a slightly ridiculous story associated with the radical that contains the definition of the radical itself.
   食's mnenomic courtesy of Wanikani: "You put on your hat and go outside to kick something white. It's a big white goose and you 
   killed it with your kick. That's because you're going to cook and <em>eat</em> it. Yum!" The definition of the radical is in this case
   is "eat".
  </p>`;
}

function explainKanji(){
  document.querySelector("#extraInfo").innerHTML = `<h2>What is kanji?</h2>
  <p>Kanji is Japanese writing system that utilizes Chinese characters to express meaning.</p>
  <h2>Onyomi?</h2>
  <p>Each kanji has either one or several onyomi and kunyomi pronunciations associated with it. Onyomi is the reading for the Kanji
   that is derived from the actual Chinese pronunciations of the character in question. For example in Chinese the character 山 is 
   pronounced like "sān" with a emphasis on the a. In Japanese the onyomi is also pronounced and represented in writing as "san" or 
   「さん」, though it is not an exact 1:1 match in onyomi and chinese pronunciation for many other kanji.
  </p>
  <h2>Kunyomi?</h2>
  <p>Kunyomi is like the same as onyomi but this time is the original Japanese created reading and pronunciation.
   山: ya|ma or 「やま」。
  </p>
  <h2>When do I use onyomi?</h2>
  <p>Written down the onyomi and kunyomi readings are not relevant as just the kanji character is used, but when pronounced 
   or read the different readings are important. Onyomi is usually used when the kanji is placed next to another kanji in a 
   sentence or phrase. For instance the vocabulary word: 「三人」is composed of the kanji characters that mean: three + people.
    As they are both kanji, the kanji for three is pronounced as "san" or 「さん」, the same way as in chinese. The kanji for 
    people then is pronounced as "nin" or 「にん」. 
  </p>
  <h2>When do I use kunyomi?</h2>
  <p>If the kanji is not placed next to other kanji, shown in 「大きい」since 「きい」is not kanji, then the kunyomi pronunciation
  is used in addition to the other Japanese characters present. Other instances for when the kunyomi is used would be if the 
  kanji character is by itself or if the vocabulary word is a compound word such as 「青葉」young + leaves then the kunyomi 
  pronunciations are used as in あお＋ば.
  </p>`;
}

function explainVocabulary(){
  document.querySelector("#extraInfo").innerHTML = `<h2>Vocabulary?</h2>        
  <p>Japanese vocabulary encompasses pretty much all all the words that you would say in Japanese. From verbs to adverbs, nouns,
      pronouns, adjectives, etc. Try out some "to" verbs, like "to die", "to fall down" or other common phrases like "lack of 
      filial piety. (Check out one of the definitions for "national treasure)". 
  </p>
  <h2>Kana</h2>
  <p>Kana is just the pronunciation of the vocabulary in <a href="https://en.wikipedia.org/wiki/Hiragana">hiragana</a>.</p>
  <h2>Kanji?</h2>
  <p>Kanji are the symbolic characters taken from Chinese scripture which contain meaning. Kanji will often be paired up with 
    simpler looking characters such as: え、て、る、し、etc, which are hiragana. These hiragana attached to the end of the kanji
    alters the meaning of the kanji slightly. For instance 「泳」has a kanji definition of "swim". If a 「ぐ」is attached to the 
    end of the kanji to become 「泳ぐ」, the definition then becomes "to swim" which is also a verb.
  </p>`;
}