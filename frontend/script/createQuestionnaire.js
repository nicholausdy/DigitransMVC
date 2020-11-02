var url = "http://206.189.153.47";
var questionsList = [];
var idNomor = 0;
let idOptionsList = []; //list of max option id for each question
let idOptionsListIterator = 0;
var idOptions;
var idCek = 0;
var idCheck = 0;


async function createQuestions(){
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
  let iteratorToAccessOptionList = 0;
  for(let i=1;i<=idNo;i++){
    let radioList = [];
    let checkboxList = []
    console.log(i);

    let questionDescriptionElem = document.getElementById('question_description'+[i]);
    let questionTypeElem = document.getElementById('question_type'+[i]);
    let isRequiredElem = document.getElementById('question_isRequired'+[i]);

    if(questionTypeElem.value === "text"){
      const daftarPertanyaanText = {
        question_description: questionDescriptionElem.value,
        type: questionTypeElem.value,
        isrequired: isRequiredElem.value,
      }
      questionsList.push(daftarPertanyaanText);
    }
    if(questionTypeElem.value === "radio"){
      const daftarPertanyaanRadio = {
        question_description: questionDescriptionElem.value,
        type: questionTypeElem.value,
        isrequired: isRequiredElem.value,
        options: radioList,
      }
      iteratorToAccessOptionList += 1;
      for(let j=1;j<=idOptionsList[iteratorToAccessOptionList];j++){
        let optionDescriptionElem = document.getElementById('description'+[i]+[j]);
        let optionScoreElem = document.getElementById('score'+[i]+[j]);
        const listsOfRadio = {
          "description":optionDescriptionElem.value,
          "score":parseInt(optionScoreElem.value),
        }
        radioList.push(listsOfRadio);
      }
      questionsList.push(daftarPertanyaanRadio);
    }
    if(questionTypeElem.value === "checkbox"){
      const daftarPertanyaanCheckbox = {
        question_description: questionDescriptionElem.value,
        type: questionTypeElem.value,
        isrequired: isRequiredElem.value,
        options: checkboxList,
      }
      iteratorToAccessOptionList += 1;
      for(let j=1;j<=idOptionsList[iteratorToAccessOptionList];j++){
        let optionDescriptionElem = document.getElementById('descriptionCheckbox'+[i]+[j]);
        let optionScoreElem = document.getElementById('scoreCheckbox'+[i]+[j]);
        const listsOfCheckbox = {
          "description":optionDescriptionElem.value,
          "score":parseInt(optionScoreElem.value),
        }
        checkboxList.push(listsOfCheckbox);
      }
      questionsList.push(daftarPertanyaanCheckbox);
    }
  };
  console.log(idOptionsList)
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
  idOptions = 0;

  idCheck += 1;
  window.localStorage.setItem('idChecks',idCheck);

  createDivQuestions();

  idOptionsListIterator += 1;

  let questionDescriptionCell = document.createElement('div');

  let typeCell = document.createElement('div');

  let isRequiredCell = document.createElement('div');

  let tombolAddOptionCell = document.createElement('div');

  let listsOptionsCell = document.createElement('div');
  listsOptionsCell.setAttribute('id','listsOptions'+[idCheck]);

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
  tombolAddOption.setAttribute('onclick','addOptionsRadio()');  
  tombolAddOption.innerHTML = 'Add Option';

  questionDescriptionCell.appendChild(questionDescription);

  typeCell.appendChild(type);

  isRequiredCell.appendChild(isRequired);

  tombolAddOptionCell.appendChild(tombolAddOption);

  let container = document.createElement('div');
  container.appendChild(questionDescriptionCell);
  container.appendChild(typeCell);
  container.appendChild(isRequiredCell);
  container.appendChild(tombolAddOptionCell);
  container.appendChild(listsOptionsCell);
  container.appendChild(questionTextCell);
  container.appendChild(questionRadioCell);
  container.appendChild(questionCheckboxCell);

  let section = document.getElementById('listQuestions');
  section.appendChild(container);

  window.localStorage.setItem('idNumber',idNomor);
};

async function createDivQuestionsCheckbox(){
  idOptions = 0;

  idCek += 1;
  window.localStorage.setItem('idChecking',idCek);

  createDivQuestions();
  idOptionsListIterator += 1;

  let questionDescriptionCell = document.createElement('div');

  let typeCell = document.createElement('div');

  let isRequiredCell = document.createElement('div');

  let tombolAddOptionCell = document.createElement('div');

  let listsOptionsCell = document.createElement('div');
  listsOptionsCell.setAttribute('id','listsOptionsCheckbox'+[idCek]);

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
  tombolAddOption.setAttribute('onclick','addOptionsCheckbox()');  
  tombolAddOption.innerHTML = 'Add Option';

  questionDescriptionCell.appendChild(questionDescription);

  typeCell.appendChild(type);

  isRequiredCell.appendChild(isRequired);

  tombolAddOptionCell.appendChild(tombolAddOption);

  let container = document.createElement('div');
  container.appendChild(questionDescriptionCell);
  container.appendChild(typeCell);
  container.appendChild(isRequiredCell);
  container.appendChild(tombolAddOptionCell);
  container.appendChild(listsOptionsCell);
  container.appendChild(questionTextCell);
  container.appendChild(questionRadioCell);
  container.appendChild(questionCheckboxCell);

  let section = document.getElementById('listQuestions');
  section.appendChild(container);

  window.localStorage.setItem('idNumber',idNomor);
};


async function addOptionsRadio(){
  idOptions = idOptions + 1;
  idOptionsList[idOptionsListIterator] = idOptions;

  let idMengecek = localStorage.getItem('idChecks');

  let listOptions = document.createElement('div');
  listOptions.setAttribute('id','listsOptions');

  let optionDescriptionCell = document.createElement('div');

  let optionScoreCell = document.createElement('div');

  description = document.createElement('input');
  description.setAttribute('id','description'+[idNomor]+[idOptions]);

  score = document.createElement('input');
  score.setAttribute('id','score'+[idNomor]+[idOptions]);

  optionDescriptionCell.appendChild(description);
  optionScoreCell.appendChild(score);

  let container = document.createElement('div');
  container.appendChild(optionDescriptionCell);
  container.appendChild(optionScoreCell);

  let section = document.getElementById('listsOptions'+[idMengecek]);
  section.appendChild(container);
};

async function addOptionsCheckbox(){
  idOptions = idOptions + 1;
  idOptionsList[idOptionsListIterator] = idOptions;
  let idMengecek = localStorage.getItem('idChecking');

  let listOptions = document.createElement('div');
  listOptions.setAttribute('id','listsOptions');

  let optionDescriptionCell = document.createElement('div');

  let optionScoreCell = document.createElement('div');

  description = document.createElement('input');
  description.setAttribute('id','descriptionCheckbox'+[idNomor]+[idOptions]);

  score = document.createElement('input');
  score.setAttribute('id','scoreCheckbox'+[idNomor]+[idOptions]);

  optionDescriptionCell.appendChild(description);
  optionScoreCell.appendChild(score);

  let container = document.createElement('div');
  container.appendChild(optionDescriptionCell);
  container.appendChild(optionScoreCell);

  let section = document.getElementById('listsOptionsCheckbox'+[idMengecek]);
  section.appendChild(container);
};