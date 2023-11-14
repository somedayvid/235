window.onload = (e) => {
  document.querySelector("#search").onclick = searchButtonClicked
  allVocab();
  allKanji();
  allRadicals();
};
let mainKanjiArray = [];
let mainVocabArray = [];
let mainRadicalsArray = [];
function searchButtonClicked(){
  let searchBy = document.querySelector("#type").value;
  let difficulty = document.querySelector("#levels").value;
  accessData(searchBy, difficulty);
}


function allRadicals(){
  var apiToken = ' 89abe689-ce3d-4035-acfd-65d442782f72 ';
  var apiEndpointPath = 'subjects?types=radical';
  var requestHeaders =
    new Headers({
      Authorization: 'Bearer ' + apiToken,
    });
  var apiEndpoint =
    new Request('https://api.wanikani.com/v2/' + apiEndpointPath, {
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

function allKanji(){
  var apiToken = ' 89abe689-ce3d-4035-acfd-65d442782f72 ';
  var apiEndpointPath = 'subjects?types=kanji';
  var requestHeaders =
    new Headers({
      Authorization: 'Bearer ' + apiToken,
    });
  var apiEndpoint =
    new Request('https://api.wanikani.com/v2/' + apiEndpointPath, {
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
  var apiToken = ' 89abe689-ce3d-4035-acfd-65d442782f72 ';
  if(nextURL != null){
    var requestHeaders =
    new Headers({
      Authorization: 'Bearer ' + apiToken,
    });
    var apiEndpoint =
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

function allVocab(){
  var apiToken = ' 89abe689-ce3d-4035-acfd-65d442782f72 ';
  var apiEndpointPath = 'subjects?types=vocabulary';
  var requestHeaders =
    new Headers({
      Authorization: 'Bearer ' + apiToken,
    });
  var apiEndpoint =
    new Request('https://api.wanikani.com/v2/' + apiEndpointPath, {
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
  var apiToken = ' 89abe689-ce3d-4035-acfd-65d442782f72 ';
  if(nextURL != null){
    var requestHeaders =
    new Headers({
      Authorization: 'Bearer ' + apiToken,
    });
    var apiEndpoint =
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

function accessData(type, difficulty){
  term = document.querySelector("#searchterm").value;

  const minInclusive = 0;
  const maxInclusive = 60;

  switch(type){
      case "radical":
        getThings(mainRadicalsArray, type);
        break;
      case "vocabulary":
        getThings(mainVocabArray, type);
        break;
      case "kanji":
        getThings(mainKanjiArray, type);
        break;
      case "all": 
        break;
      default:
        console.log("Something went wrong");
        break;
    }

  // switch(difficulty){
  //   case "all":
  //     minInclusive = 0;
  //     maxInclusive = 60;
  //     break;
  //   case "pleasant":
  //     minInclusive = 0;
  //     maxInclusive = 10;
  //     break;  
  //   case "painful":
  //     minInclusive = 11;
  //     maxInclusive = 20;
  //     break;
  //   case "death":
  //     minInclusive = 21;
  //     maxInclusive = 30;
  //     break;
  //   case "hell":
  //     minInclusive = 31;
  //     maxInclusive = 40;
  //     break;
  //   case "paradise":
  //     minInclusive = 41;
  //     maxInclusive = 50;
  //     break;
  //   case "reality":
  //     minInclusive = 51;
  //     maxInclusive = 60;
  //     break;
  }


function getThings(array, type){
  let meaningsArray = [];
  let readingsArray = [];
  let readingsString = "";
  let meaningsString = "";

  let results = [];

  for(let i = 0; i < array.length;i++){
    for(let k = 0; k < array[i].data.meanings.length;k++){
      if(array[i].data.meanings[k].meaning == capitalizeFirstLetter(term)){
        results.push(array[i]);
      }
    }
  }

  let bigString = "";
  let line = "";
  if(type != "radical"){
    for(let z = 0; z < results.length;z++){
      meaningsString = "";
      readingsString = "";

      meaningsArray = results[z].data.meanings;
      for(let j = 0; j < meaningsArray.length;j++){
        meaningsString += meaningsArray[j].meaning;
        if(meaningsArray.length > j + 1){
          meaningsString += ", ";
        }
      }

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
                      <p id="readings">Readings: ${readingsString}</p>
                      <p id="slug">Kana: ${results[z].data.characters}</p>
                    </div>`;
      }
      else if(type == "kanji")
      {
        let OnString = "";
        let KunString = "";

        readingsArray = results[z].data.readings;

        console.log(readingsArray);
        for(let h = 0; h < readingsArray.length;h++){
          if(readingsArray[h].type == "onyomi"){
            OnString += readingsArray[h].reading;
            if(readingsArray[h + 1].type == "onyomi"){
              OnString += ", ";
            }
          }
          else if(readingsArray[h].type == "kunyomi"){
            KunString += readingsArray[h].reading;
            if(readingsArray[h + 1] != null && readingsArray[h + 1].type == "kunyomi"){
              KunString += ", ";
            }
          }
        }
        line = `<div class ='result'>
                      <p id="meanings">Meanings: ${meaningsString}</p>
                      <p id="onyomi">Onyomi: ${OnString}</p>
                      <p id="kunyomi">Kunyomi: ${KunString}</p>
                      <p id="slug">Kanji: ${results[z].data.characters}</p>
                    </div>`;
      }
    }
  }
  else
  {
    for(let i = 0; i < array.length;i++)
    {
      if(array[i].data.slug == lowercaseFirstLetter(term))
      {
        line = `<div class ='result'>
                      <p id="identifier">Identifier: ${array[i].data.slug}</p>
                      <p id="character">Character: ${array[i].data.characters}</p>
                    </div>`;
      }
    }
  }
bigString += line;

document.querySelector("#display").innerHTML = bigString;
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function lowercaseFirstLetter(string){
  return string.charAt(0).toLowerCase() + string.slice(1);
}

function sortByLevel(data){
  if(minInclusive <= data.data.level <= maxInclusive){
    return true;
  }
  else return false;
}