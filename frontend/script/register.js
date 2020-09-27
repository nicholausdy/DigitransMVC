var url = "http://206.189.153.47:2020";

async function signUp() {
  let emailElem = document.getElementById("email");
  let passwordElem = document.getElementById("password");
  let verifyPasswordElem = document.getElementById("verifyPassword");
  let institutionElem = document.getElementById("institution");
  let nameElem = document.getElementById("name");
  let phoneNumberElem = document.getElementById("phoneNumber");
  let jobElem = document.getElementById("job");
  let testingPassword = passwordElem.value;
  let testingKonfirmasi = verifyPasswordElem.value;
  let regularExpression  = /^(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
  if(testingKonfirmasi != testingPassword){
      alert("Password and confirmation don't match");
    }
  else{
    if((testingPassword.length<6) || (testingPassword.length>16)){
    alert("Paswword must be between 6-16 characters");
  	}
  else{
    if(!regularExpression.test(testingPassword)){
      alert("Password should contain at least one special character");
    }
    else{
       let response = await fetch(`${url}/public/user/register`, {
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
        password1: verifyPasswordElem.value,
        institution: institutionElem.value,
        name: nameElem.value,
        phone_number: phoneNumberElem.value,
        job: jobElem.value,
       }),
      });
       const resp = await response.json();
       console.log(resp);
       console.log(resp.message);
          if (resp.message == "Registraton successful. Please check your email") {
            let urlPart1 = window.location.href.split("/");
            window.location =
              urlPart1.splice(0, urlPart1.length - 1).join("/") + "/verification.html";
          } 
          else {
            alert("This email already exists");
          } 
      }
    }
  }
};