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
  
  function sortByLevel(data){
    if(minInclusive <= data.data.level && data.data.level <= maxInclusive ){
      return true;
    }
    else 
  return false;
  }