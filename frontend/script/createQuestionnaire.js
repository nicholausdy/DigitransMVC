var url = "http://206.189.153.47:2020";

async function createQuestionnaire(){
  let testing_email = localStorage.getItem('email');
  console.log(testing_email);
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
      "email": localStorage.getItem('email'),
      "questionnaire_title": questionnaireTitleElem.value,
      "questionnaire_desc": questionnaireDescriptionElem.value,
    }),
  });

  window.localStorage.setItem('questionnaireID',resp.message);

}

async function createQuestions(){
  let questionnaireId = localStorage.getItem('questionnaireID');
  console.log(questionnaireId);

  let questionDescriptionElem = document.getElementById("question_description");
  let questionTypeElem = document.getElementById('question_type');
  let isRequiredElem = document.getElementById('question_isRequired');


  let response = await fetch(`${url}/private/questions`,{
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode:"cors",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('token'),
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify({
      "questionnaire_id": questionnaireId,
      "questions":
      [
        {
          "question_description":questionDescriptionElem.value,
          "type":questionTypeElem.value,
          "isrequired":isRequiredElem.value,
        }
      ]
    }),
  });
    console.log(questionDescriptionElem.value);
    console.log(questionTypeElem.value);
   console.log(isRequiredElem.value);
  let result = await response.json();
  console.log(result);
};

async function createDivQuestions(){
  let questionDescriptionCell = document.createElement('div');

  let typeCell = document.createElement('div');

  let isRequiredCell = document.createElement('div');

  let questionDescription = document.createElement('input');
  questionDescription.setAttribute('id','question_description');

  let type = document.createElement('input');
  type.setAttribute('id','question_type');

  let isRequired = document.createElement('input');
  isRequired.setAttribute('id','question_isRequired');

  questionDescriptionCell.appendChild(questionDescription);

  typeCell.appendChild(type);

  isRequiredCell.appendChild(isRequired);

  let container = document.createElement('div');
  container.appendChild(questionDescriptionCell);
  container.appendChild(typeCell);
  container.appendChild(isRequiredCell);

  let section = document.getElementById('listQuestions');
  section.appendChild(container);
}