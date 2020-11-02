var url = "http://206.189.153.47";

async function createRow(i,questionnaireTitle,questionnaireDescription,questionnaireId){
	let numCell = document.createElement('td');
	numCell.innerText = i;

	let questionnaireTitleCell = document.createElement('td');

  textQuestionnaireTitle = document.createTextNode(questionnaireTitle);
   
  let logoEdit = document.createElement('img');
  logoEdit.setAttribute('src','assets/img/editSupplier.png');
  logoEdit.setAttribute('style','margin-left:1.5%;cursor:pointer');

	let questionnaireDescriptionCell = document.createElement('td');
	questionnaireDescriptionCell.innerText = questionnaireDescription;

	let questionnaireIdCell = document.createElement('td');
	questionnaireIdCell.innerText = questionnaireId;

	let detailCell = document.createElement('td');
	detailCell.setAttribute('style','cursor:pointer');
	detailCell.innerHTML = `<span class="label label-info pull-left" >Detail</span>`

	let scoreCell = document.createElement('td');
  scoreCell.setAttribute('style','cursor:pointer');
	scoreCell.innerHTML = `<span class="label label-success pull-left" >Score</span>`

	let deleteCell = document.createElement('td');
  deleteCell.setAttribute('style','cursor:pointer');
	deleteCell.innerHTML = `<span class="label label-danger pull-left">Delete</span>`

	detailCell.addEventListener('click', () => getDetails(questionnaireId));
  scoreCell.addEventListener('click', () => getScore(questionnaireId));
	deleteCell.addEventListener('click', () => deleteQuestionnaire(questionnaireId));
  
  logoEdit.addEventListener('click', () => getUpdate(questionnaireId,questionnaireTitle,questionnaireDescription));

  questionnaireTitleCell.appendChild(textQuestionnaireTitle);
  questionnaireTitleCell.appendChild(logoEdit);
  	
	let row = document.createElement('tr');
	row.appendChild(numCell);
	row.appendChild(questionnaireTitleCell);
	row.appendChild(questionnaireDescriptionCell);
	row.appendChild(questionnaireIdCell);
	row.appendChild(detailCell);
	row.appendChild(scoreCell);
	row.appendChild(deleteCell);

	let table = document.getElementById('listOfQuestionnaires');
	table.appendChild(row);
}

async function getDetails(questionnaireID){
	window.localStorage.setItem('showQuestionnaireId',questionnaireID);
  modalAnswererEmail.style.display = "block";
};

async function submitAnswererEmail(){
  let emailElem = document.getElementById("showAnswererEmail");

  window.localStorage.setItem('showAnswererEmail',emailElem.value);

  let urlPart1 = window.location.href.split("/");
    window.location = urlPart1.splice(0, urlPart1.length - 1).join("/") + "/showAnswer.html";
}

async function loadQuestionnaires(){
	let email = localStorage.getItem('email');

	let response = await fetch(`${url}/private/getQuestionnaires`,{
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode:"cors",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('token'),
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify({
      "email":email,
    }),
  });
  let data = await response.json();
  console.log(data);
  let i=1;
  for ( let item of data.message) {
  	createRow(i,item.QuestionnaireTitle,item.QuestionnaireDescription,item.QuestionnaireId);
  	i++;
  }
};

async function loadQuestions(){
	let questionnaireId = localStorage.getItem('answererQuestionnaireId');

	let response = await fetch(`${url}/private/getQuestions`,{
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode:"cors",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('token'),
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify({
      "questionnaire_id":questionnaireId,
    }),
  });
  let data = await response.json();
  console.log(data);
  let item = data.message;
  let component = item.questions;
  for(let i=0;i<component.length;i++){
  	if(component[i].type === "text"){
  		createContainerText(component[i].question_description);
  	}
  	if(component[i].type === "radio"){
  		createContainerRadio(component[i].question_description,component[i].score,component[i].options.length);
      for(let j=0;j<component[i].options.length;j++){
        createOptionsRadio(component[i].options[j].description,component[i].options[j].score);
      }
  	}
  	if(component[i].type === "checkbox"){
  		createContainerCheckbox(component[i].question_description,component[i].score,component[i].options.length);
      for(let j=0;j<component[i].options.length;j++){
        createOptionsCheckbox(component[i].options[j].description,component[i].options[j].score);
      }
  	}
  }
};

async function submitAnswererData(){
	let nameElem = document.getElementById('answererName');
	let emailElem = document.getElementById('answererEmail');
	let companyElem = document.getElementById('answererCompany');
  let idElem = document.getElementById('answererQuestionnaireId');

	window.localStorage.setItem('answererName',nameElem.value);
	window.localStorage.setItem('answererEmail',emailElem.value);
	window.localStorage.setItem('answererCompany',companyElem.value);
  window.localStorage.setItem('answererQuestionnaireId',idElem.value);

	let urlPart1 = window.location.href.split("/");
    window.location =
    urlPart1.splice(0, urlPart1.length - 1).join("/") + "/answer.html";
};