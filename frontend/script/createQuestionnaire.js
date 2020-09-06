var url = "http://206.189.153.47:2020";
var questionsList = [];
var idNomor = 0;


async function createQuestionsText(){
  let testing_email = localStorage.getItem('email');
  console.log(testing_email);
  let questionnaireTitleElem = document.getElementById("questionnaireTitle");
  let questionnaireDescriptionElem = document.getElementById("questionnaireDescription");

  let responses = await fetch(`${url}/private/questionnaire`, {
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
  let resps = await responses.json();
  window.localStorage.setItem('questionnaireID',resps.message);

  let idNo = localStorage.getItem('idNumber');
  console.log(idNo);
  
  for(let i=1;i<=idNo;i++){
    console.log(i);

    let questionDescriptionElem = document.getElementById('question_description'+[i]);
    let questionTypeElem = document.getElementById('question_type'+[i]);
    let isRequiredElem = document.getElementById('question_isRequired'+[i]);

    const daftarPertanyaan = {
      question_description: questionDescriptionElem.value,
      type: questionTypeElem.value,
      isrequired: isRequiredElem.value,
    }
    questionsList.push(daftarPertanyaan);
  };
  console.log(questionsList);
  console.log(JSON.stringify(questionsList));
  let questionnaireId = localStorage.getItem('questionnaireID');
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
        "questions": questionsList,
      }),
    });
    let result = await response.json();
    console.log(result);
};

async function createDivQuestions(){
  idNomor = idNomor + 1;
}

async function createDivQuestionsText(){
  createDivQuestions();

  let questionDescriptionCell = document.createElement('div');

  let typeCell = document.createElement('div');

  let isRequiredCell = document.createElement('div');

  let questionTextCell = document.createElement('button');
  questionTextCell.innerHTML = "Add Text Questions";
  questionTextCell.setAttribute('class','btn btn-primary');
  questionTextCell.setAttribute('onclick','createDivQuestionsText()');
  questionTextCell.setAttribute('style','margin-right:3%');

  let questionRadioCell = document.createElement('button');
  questionRadioCell.innerHTML = "Add Radio Questions";
  questionRadioCell.setAttribute('class','btn btn-primary');
  questionRadioCell.setAttribute('onclick','createDivQuestionsRadio()');
  questionRadioCell.setAttribute('style','margin-right:3%');

  let questionCheckboxCell = document.createElement('button');
  questionCheckboxCell.innerHTML = "Add Checkbox Questions";
  questionCheckboxCell.setAttribute('class','btn btn-primary');
  questionCheckboxCell.setAttribute('onclick','createDivQuestionsCheckbox()');
  questionCheckboxCell.setAttribute('style','margin-right:3%');

  let questionDescription = document.createElement('input');
  questionDescription.setAttribute('id','question_description'+[idNomor]);

  let type = document.createElement('input');
  type.setAttribute('id','question_type'+[idNomor]);

  let isRequired = document.createElement('input');
  isRequired.setAttribute('id','question_isRequired'+[idNomor]);

  questionDescriptionCell.appendChild(questionDescription);

  typeCell.appendChild(type);

  isRequiredCell.appendChild(isRequired);

  let container = document.createElement('div');
  container.appendChild(questionDescriptionCell);
  container.appendChild(typeCell);
  container.appendChild(isRequiredCell);
  container.appendChild(questionTextCell);
  container.appendChild(questionRadioCell);
  container.appendChild(questionCheckboxCell);

  let section = document.getElementById('listQuestions');
  section.appendChild(container);

  window.localStorage.setItem('idNumber',idNomor);
};

async function createDivQuestionsRadio(){
 createDivQuestions();

  let questionDescriptionCell = document.createElement('div');

  let typeCell = document.createElement('div');

  let isRequiredCell = document.createElement('div');

  let tombolAddOptionCell = document.createElement('div');

  let questionTextCell = document.createElement('button');
  questionTextCell.innerHTML = "Add Text Questions";
  questionTextCell.setAttribute('class','btn btn-primary');
  questionTextCell.setAttribute('onclick','createDivQuestionsText()');
  questionTextCell.setAttribute('style','margin-right:3%');

  let questionRadioCell = document.createElement('button');
  questionRadioCell.innerHTML = "Add Radio Questions";
  questionRadioCell.setAttribute('class','btn btn-primary');
  questionRadioCell.setAttribute('onclick','createDivQuestionsRadio()');
  questionRadioCell.setAttribute('style','margin-right:3%');

  let questionCheckboxCell = document.createElement('button');
  questionCheckboxCell.innerHTML = "Add Checkbox Questions";
  questionCheckboxCell.setAttribute('class','btn btn-primary');
  questionCheckboxCell.setAttribute('onclick','createDivQuestionsCheckbox()');
  questionCheckboxCell.setAttribute('style','margin-right:3%');

  let questionDescription = document.createElement('input');
  questionDescription.setAttribute('id','question_description'+[idNomor]);

  let type = document.createElement('input');
  type.setAttribute('id','question_type'+[idNomor]);

  let isRequired = document.createElement('input');
  isRequired.setAttribute('id','question_isRequired'+[idNomor]);

  let tombolAddOption = document.createElement('button');
  tombolAddOption.setAttribute('onclick','addOptions()');  

  questionDescriptionCell.appendChild(questionDescription);

  typeCell.appendChild(type);

  isRequiredCell.appendChild(isRequired);

  tombolAddOptionCell.appendChild(tombolAddOption);

  let container = document.createElement('div');
  container.appendChild(questionDescriptionCell);
  container.appendChild(typeCell);
  container.appendChild(isRequiredCell);
  container.appendChild(tombolAddOptionCell);
  container.appendChild(questionTextCell);
  container.appendChild(questionRadioCell);
  container.appendChild(questionCheckboxCell);

  let section = document.getElementById('listQuestions');
  section.appendChild(container);

  window.localStorage.setItem('idNumber',idNomor);
};

async function createDivQuestionsCheckbox(){
  createDivQuestions();

  let questionDescriptionCell = document.createElement('div');

  let typeCell = document.createElement('div');

  let isRequiredCell = document.createElement('div');

  let questionTextCell = document.createElement('button');
  questionTextCell.innerHTML = "Add Text Questions";
  questionTextCell.setAttribute('class','btn btn-primary');
  questionTextCell.setAttribute('onclick','createDivQuestionsText()');
  questionTextCell.setAttribute('style','margin-right:3%');

  let questionRadioCell = document.createElement('button');
  questionRadioCell.innerHTML = "Add Radio Questions";
  questionRadioCell.setAttribute('class','btn btn-primary');
  questionRadioCell.setAttribute('onclick','createDivQuestionsRadio()');
  questionRadioCell.setAttribute('style','margin-right:3%');

  let questionCheckboxCell = document.createElement('button');
  questionCheckboxCell.innerHTML = "Add Checkbox Questions";
  questionCheckboxCell.setAttribute('class','btn btn-primary');
  questionCheckboxCell.setAttribute('onclick','createDivQuestionsCheckbox()');
  questionCheckboxCell.setAttribute('style','margin-right:3%');

  let questionDescription = document.createElement('input');
  questionDescription.setAttribute('id','question_description'+[idNomor]);

  let type = document.createElement('input');
  type.setAttribute('id','question_type'+[idNomor]);

  let isRequired = document.createElement('input');
  isRequired.setAttribute('id','question_isRequired'+[idNomor]);

  questionDescriptionCell.appendChild(questionDescription);

  typeCell.appendChild(type);

  isRequiredCell.appendChild(isRequired);

  let container = document.createElement('div');
  container.appendChild(questionDescriptionCell);
  container.appendChild(typeCell);
  container.appendChild(isRequiredCell);
  container.appendChild(questionTextCell);
  container.appendChild(questionRadioCell);
  container.appendChild(questionCheckboxCell);

  let section = document.getElementById('listQuestions');
  section.appendChild(container);

  window.localStorage.setItem('idNumber',idNomor);
};

async function addOptions(){
  
}