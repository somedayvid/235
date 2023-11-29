function capitalizeEachWord(string) {
    const sentence = string;
    const words = sentence.split(" ");
    const together = words.map(capitalizeFirstLetter);
    return together.join(" ");
  }
  
  function capitalizeFirstLetter(word){
    return word.charAt(0).toUpperCase() + word.slice(1);
  }
  
  function lowercaseFirstLetter(string){
    return string.charAt(0).toLowerCase() + string.slice(1);
  }

  //adjusts feedback to user to ensure their search options are configured correctly
  function hasResults(results){
    if(results.length <= 0){
      if(document.querySelector("#searchby").value == "level" && isNaN(term)){
        document.querySelector("#numresults").innerHTML = `Please input a NUMBER between 1 and 60(inclusive) in order to search by LEVEL or choose DEFINITION in the search by dropdown.`;
      }
      else if(document.querySelector("#searchby").value == "def" && isNaN(term) == false)
      document.querySelector("#numresults").innerHTML = `Please input a WORD in order to search by DEFINITION or choose LEVEL in the search by dropdown.`;
      else{
      document.querySelector("#numresults").innerHTML = `No results found for "${term}"`;
      }
      return false;
    }
    else return true;
  }