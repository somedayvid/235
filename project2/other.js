document.addEventListener("DOMContentLoaded", () => {
    const title = document.querySelectorAll("#test");
    title.onclick = test;
    console.log(title);
})


function test(){
  console.log("HEllo world"); 
} 
