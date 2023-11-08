window.onload = () => {
    testing();
};

function testing(){
    const p = document.querySelector("#hi");
    var apiToken = ' 89abe689-ce3d-4035-acfd-65d442782f72 ';
    var apiEndpointPath = 'subjects/44';
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
      .then(responseBody => p.innerHTML = responseBody.data.meaning_mnemonic
      );
}