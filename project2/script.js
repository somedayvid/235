window.onload = (e) => {
  document.querySelector("#search").onclick = searchButtonClicked
  allVocab();
};

function searchButtonClicked(){
  let searchBy = document.querySelector("#type").value;
  accessData(searchBy);
}
let mainVocabArray = [];

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
      repeating(responseBody.pages.next_url, " 89abe689-ce3d-4035-acfd-65d442782f72 ");
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

function accessData(type){
  const character = document.querySelector("#character");
  const meaning = document.querySelector("#meaning");
  const reading = document.querySelector("#reading");
  
  term = document.querySelector("#searchterm").value;

  var apiToken = '89abe689-ce3d-4035-acfd-65d442782f72';
  var apiEndpointPath = 'subjects';
  var requestHeaders =
    new Headers({
      Authorization: 'Bearer ' + apiToken,
    });

  var apiEndpoint =
    new Request('https://api.wanikani.com/v2/' + apiEndpointPath + `?types=${type}`, {
      method: 'GET',
      headers: requestHeaders
    });
  fetch(apiEndpoint)
    .then(response => response.json())
    .then(responseBody => {switch(type){
      case "radical":
       // getRadical(responseBody);
       //console.log(responseBody);
        break;
      case "vocabulary":
        //getThings(responseBody, type);
        //console.log(responseBody);
        break;
      case "kanji":
        //getThings(responseBody, type);
        console.log(responseBody);
        break;
      case "all": 
        break;
      default:
        console.log("Something went wrong");
        break;
    }}
    );

}

//still need to get functional for the rest of the 5 thousand vocabulary
function getThings(responseBody, type){
  let meaningsArray = [];
  let readingsArray = [];
  let readingsString = "";
  let meaningsString = "";
  let OnString = "";
  let KunString = "";
  const onyomiEl = document.querySelector("#onyomi");
  const kunyomiEl = document.querySelector("#kunyomi");

  kunyomiEl.innerHTML = "";
  onyomiEl.innerHTML = "";  

  for(let i = 0; i < responseBody.data.length;i++){
    for(let k = 0; k < responseBody.data[i].data.meanings.length;k++){
      if(responseBody.data[i].data.meanings[k].meaning == capitalizeFirstLetter(term)){
        character.innerHTML = responseBody.data[i].data.characters;
        meaningsArray = responseBody.data[i].data.meanings;
        readingsArray = responseBody.data[i].data.readings;
        meaningsString = "";
        for(let j = 0; j < meaningsArray.length;j++){
          meaningsString += meaningsArray[j].meaning
          if(meaningsArray.length > j + 1){
            meaningsString += ", "
          }
        }
      }
    }
  }
  if(type == "vocabulary")
  {
    getVocab(readingsArray, meaningsString, readingsString);
  }
  if(type == "kanji"){
    console.log(readingsArray);
    getKanji(onyomiEl,kunyomiEl, readingsArray, meaningsString);
  }
}

function getVocab(readings, meaningsString, readingsString){
  for(let h = 0; h < readings.length;h++){
    readingsString += readings[h].reading
    if(readings.length > h + 1){
      readingsString += ", "
    }
  }
  reading.innerHTML = readingsString;
  meaning.innerHTML = meaningsString;    
}

function getKanji(onyomiElement, kunyomiElement, readingsArray, meaningsString){
  OnString = "Onyomi: ";
  KunString = "Kunyomi: ";
   
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
  onyomiElement.innerHTML = OnString;
  kunyomiElement.innerHTML = KunString;
  meaning.innerHTML = meaningsString;
}

function getAll(responseBody){
  console.log(responseBody);
}

function getRadical(responseBody){
  //console.log(responseBody);
  for(let i = 0; i < responseBody.data.length;i++){
    if(responseBody.data[i].data.slug == lowercaseFirstLetter(term))
    {
      character.innerHTML = responseBody.data[i].data.characters;
      meaning.innerHTML = responseBody.data[i].data.slug;
      reading.innerHTML = "";
      console.log(responseBody.data[i].data.characters); //problem not showing wtf
    }
  }
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function lowercaseFirstLetter(string){
  return string.charAt(0).toLowerCase() + string.slice(1);
}