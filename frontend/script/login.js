var url = "http://206.189.153.47";

async function login() {
  let emailElem = document.getElementById("email");
  let passwordElem = document.getElementById("password");

       let response = await fetch(`${url}/public/user/login`, {
       method: "POST", // *GET, POST, PUT, DELETE, etc.
       mode: "cors", // no-cors, *cors, same-origin
       cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
       headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
       },
       body: JSON.stringify({
        email: emailElem.value,
        password: passwordElem.value,
       }),
      });
      let resp = await response.json();
      console.log(resp);
      window.localStorage.setItem('token',resp.message);
      window.localStorage.setItem('email',emailElem.value);
      if(resp.success==true){
        let urlPart1 = window.location.href.split("/");
           window.location =
             urlPart1.splice(0, urlPart1.length - 1).join("/") + "/landingPage.html";
      }
      else{
        alert("Invalid Login");
      }
};