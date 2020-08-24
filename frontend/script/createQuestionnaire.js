var url = "http://206.189.153.47:2020";

async function createQuestionnaire(){
  let emailElem = localStorage.getItem('email');
  let questionnaireTitleElem = document.getElementById("questionnaireTitle");
  let questionnaireDescriptionElem = document.getElementById("questionnaireDescription");


  let response = await fetch(`${url}/private/questionnaire`, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode:"cors",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('token'),
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify({
      "email": supplierNameElem.value,
      "questionnaire_title": questionnaireTitleElem.value,
      "questionnaire_desc": questionnaireDescriptionElem.value,
    }),
  });
  let resp = await response.json();
  console.log(resp);
  console.log(resp.message);
}