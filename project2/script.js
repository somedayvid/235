
let mainKanjiArray = [];
let mainVocabArray = [];
let mainRadicalsArray = [];
let term = "";
let timesToLoop = 0;
let x;
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
  typeSelector.onchange = displayExplanation;

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
  getAllWords("radical",'https://api.wanikani.com/v2/subjects?types=radical');
  getAllWords("kanji", 'https://api.wanikani.com/v2/subjects?types=kanji');
  getAllWords("vocabulary", 'https://api.wanikani.com/v2/subjects?types=vocabulary');
};

//is called each time a locally stored value is changed to ensure all changes are accounted for
function storeAll(){
  localStorage.setItem(searchTermKey, document.querySelector("#searchterm").value);
  localStorage.setItem(wordTypeKey, document.querySelector("#type").value);
  localStorage.setItem(searchByKey, document.querySelector("#searchby").value);
}

//gets the button search options and passes them into the data accessor
function searchButtonClicked(){
  const searchType = document.querySelector("#type").value;
  const searchBy = document.querySelector("#searchby").value;
  const resultsInfo = document.querySelector("#numresults");
  term = document.querySelector("#searchterm").value;

  document.querySelector("#display").innerHTML = "";
  
  //checks if the search term even exists first, and gives user feedback
  if(term.trim() == ""){
    if(searchBy == "level"){
      resultsInfo.innerHTML = `Please input a number between 1 and 60(inclusive)!`;
    }
    else if(searchBy == "def"){
      resultsInfo.innerHTML = `Please input a word into the search bar!`;
    }
  }
  else{

  resultsInfo.innerHTML = `Searching for definitions that match "${term}"`;

  switch(searchBy){
    case "def":
      switch(searchType){
        case "radical":
          accessByDef(searchType, mainRadicalsArray);
          break;
        case "vocabulary":
          accessByDef(searchType, mainVocabArray);
          break;
        case "kanji":
          accessByDef(searchType, mainKanjiArray);
          break;
      }
      break;
    case "level":
      switch(searchType){
        case "radical":
          accessByLevel(searchType, mainRadicalsArray);
          break;
        case "vocabulary":
          accessByLevel(searchType, mainVocabArray);
          break;
        case "kanji":
          accessByLevel(searchType, mainKanjiArray);
          break;
      }
      break;
    }
  }
}

//gets all the kanji from the api
function getAllWords(type, initialLink){
  let tempArray = [];

  fetch(new Request(initialLink, {
    method: 'GET',
    headers: requestHeaders
  }))
    .then(response => response.json())
    .then(responseBody => {
      //grabs initial page of information into temporary array
      tempArray = responseBody.data;
      //radical information only encompasses one page so it exits early, for the other types,
      //we have to loop through the rest of the pages
      if(responseBody.pages.next_url != null){
        repeatingGetWords(tempArray, type, responseBody.pages.next_url);
      }
      else mainRadicalsArray = tempArray;
    }
  );
}

//recursive method that gathers the rest of all the api data and stores them on the page
function repeatingGetWords(tempArray, type, nextURL){
    fetch(new Request(nextURL, {
      method: 'GET',
      headers: requestHeaders}))
      .then(response => response.json())
      .then(responseBody => { 
        //setting information into a temporary array and getting next page url
        const emptyArray = tempArray;
        tempArray = emptyArray.concat(responseBody.data);
        nextURL = responseBody.pages.next_url;
        //continues to loop if there is more information to get
        if(nextURL != null){
          repeatingGetWords(tempArray, type, nextURL);
        }
        else{
          //setting them to the array that they belong to
         switch(type){
          case "kanji":
            mainKanjiArray = tempArray.slice(0);
            break;
          case "vocabulary":
            mainVocabArray = tempArray.slice(0);
            break;
         }
        }
      }
  );
}

//checks for words that are the user input level, and then gathers them in a great string
function accessByLevel(type, array){
  let results = [];
  let bigString = "";

  for(let i = 0; i< array.length;i++){
    if(array[i].data.level == term.trim()){
      results.push(array[i]);
    }
  }

  if(hasResults(results)){
    document.querySelector("#numresults").innerHTML = `<p>${results.length} result(s) for level ${term} ${type}</p>`;
    document.querySelector("#display").innerHTML = getReadings(type, results, bigString);
  }
}

//checks for words that contain the user input, and then gathers them in a great string
function accessByDef(type, array){
  let results = [];
  let bigString = "";

  //first checks if the user input term will net any results
  for(let i = 0; i < array.length;i++){
    for(let k = 0; k < array[i].data.meanings.length;k++){
      if(array[i].data.meanings[k].meaning == capitalizeEachWord(term)){
        results.push(array[i]);
      }
    }
  }
  //if not then returns nothing and displays that there were no results
  if(hasResults(results)){
    document.querySelector("#numresults").innerHTML = `<p>${results.length} result(s) for "${term}"</p>`;
    document.querySelector("#display").innerHTML = getReadings(type, results, bigString);
  }
}

//gets all neccesary readings and information for each type
function getReadings(type, results, bigString){
switch(type){
  case "radical":
    for(let i = 0; i < results.length;i++)
    {
      bigString += displayResultsAsString(type, results, i);
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
    //some kanji have no readings for onyomi or kunyomi so display none instead
    if(OnString == ""){
      OnString = "None";
    }
    if(KunString == ""){
      KunString = "None";
    }
      bigString += displayResultsAsString(type, results, z,meaningsString,"", OnString, KunString, );
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
      bigString += displayResultsAsString(type, results, z, meaningsString, readingsString);
    }
    return bigString;
}
}

//contains all the ways that each type is represented in a string and returns it to be added to a greater string
function displayResultsAsString(type, resultsArray, index ,meanings = "", readings ="", onyomis="", kunyomis=""){
  switch(type){
    case "radical":
      return `<div class ='result'>
      <p id="identifier">Identifier: ${resultsArray[index].data.meanings[0].meaning}</p>
      <p id="character">Character: ${resultsArray[index].data.characters}</p>
      <p id="level">Level: ${resultsArray[index].data.level}</p>
      </div>`;
    case "kanji":
      return `<div class ='result'>
      <p id="meanings">Meanings: ${meanings}</p>
      <p id="onyomi">Onyomi: ${onyomis}</p>
      <p id="kunyomi">Kunyomi: ${kunyomis}</p>
      <p id="slug">Kanji: ${resultsArray[index].data.characters}</p>
      <p id="level">Level: ${resultsArray[index].data.level}</p>
    </div>`;
    case "vocabulary":
      return `<div class ='result'>
      <p id="meanings">Meanings: ${meanings}</p>
      <p id="readings">Kana: ${readings}</p>
      <p id="slug">Kanji: ${resultsArray[index].data.characters}</p>
      <p id="level">Level: ${resultsArray[index].data.level}</p>
    </div>`;
  }
}

//adjusts the explanation present each time the type is changed
function displayExplanation(){
  console.log(document.querySelector("#type").value);
switch(document.querySelector("#type").value){
  case "radical":
    explainRadicals();
    break;
  case "kanji":
    explainKanji();
    break;
  case "vocabulary":
    explainVocabulary();
    break;
}
}

//four remaining functions are all little sections for possible FAQs for each type in Japanese since I got a lot of 
//questions about what things do during the feedback inclass portion I thought I should maybe explain some things
//for people who don't know anything about Japanese
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