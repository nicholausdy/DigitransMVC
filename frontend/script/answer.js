var url = "http://206.189.153.47";
var idAnswer = 0;
var score = 0;
var idCekText = 0;
var idCekRadio = 0;
var idCekCheckbox = 0;
var part = 0;
var idOptions;
var answerLists = [];

async function getQuestionnaireDetails(){
  let response = await fetch(`${url}/public/getQuestionnaireById`,{
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode:"cors",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('token'),
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify({
      "questionnaire_id":localStorage.getItem("answererQuestionnaireId"),
    }),
  });
  let data = await response.json();
  console.log(data);
  let item = data.message;
  fillQuestionnaireDescription(item.QuestionnaireTitle,item.QuestionnaireDescription);
};

async function fillQuestionnaireDescription(title,description){
	let titleElem = document.getElementById('getQuestionnaireTitle');
	let descriptionElem = document.getElementById('getQuestionnaireDescription');

	titleElem.innerText = title;
	descriptionElem.innerText = description;
}
async function createContainerText(description){
	idAnswer += 1;

	let descriptionCell = document.createElement('div');

	let answerCell = document.createElement('div');
	
	let descriptions = document.createTextNode(description);

	let answer = document.createElement('input');
	answer.setAttribute('id','text'+[idAnswer]);

	descriptionCell.appendChild(descriptions);
	answerCell.appendChild(answer);

	let container = document.createElement('div');
	container.setAttribute('style','margin:3%');
	container.setAttribute('class','boxItem');
	container.appendChild(descriptionCell);
	container.appendChild(answerCell);

	let section = document.getElementById('listAnswers');
	section.appendChild(container);
	container.setAttribute('style','margin-bottom:5%');
};

async function createContainerRadio(description,point,length){
	idAnswer += 1;

	idCekRadio += 1;

	idOptions = 0;

	let descriptionCell = document.createElement('div');

	let answerCell = document.createElement('form');
	answerCell.setAttribute('id','listsOfRadioOptions'+[idCekRadio]);

	let container = document.createElement('div');
	container.setAttribute('style','margin:3%');

	let descriptions = document.createTextNode(description);

	descriptionCell.appendChild(descriptions);

	container.appendChild(descriptionCell);

	container.appendChild(answerCell);

	container.setAttribute('class','boxItem');

	container.setAttribute('style','margin-bottom:5%');

	let section = document.getElementById('listAnswers');
	section.appendChild(container);
};

async function createContainerCheckbox(description,point,length){
	idAnswer += 1;

	idCekCheckbox += 1;

	idOptions = 0;

	let descriptionCell = document.createElement('form');

	let answerCell = document.createElement('form');
	answerCell.setAttribute('id','listsOfCheckboxOptions'+[idCekCheckbox]);

	let container = document.createElement('div');
	container.setAttribute('style','margin:3%');

	let descriptions = document.createTextNode(description);

	descriptionCell.appendChild(descriptions);

	container.appendChild(descriptionCell);

	container.appendChild(answerCell);

	container.setAttribute('class','boxItem');

	container.setAttribute('style','margin-bottom:5%');

	let section = document.getElementById('listAnswers');
	section.appendChild(container);
};

async function createOptionsRadio(description,point){
	idOptions = idOptions + 1;

	let containerInput = document.createElement('input');
	let label = document.createElement('label');
	containerInput.setAttribute('type','radio');
	containerInput.setAttribute('id',[idAnswer]+[idOptions]);
	containerInput.setAttribute('value',description);
	containerInput.setAttribute('name','description'+[idCekRadio]);
	label.appendChild(containerInput);
	label.innerHTML += description;
	score = score + point;

	linebreak = document.createElement("br");

	let section = document.getElementById('listsOfRadioOptions'+[idCekRadio]);
	section.appendChild(label);
	section.appendChild(linebreak);
}

async function createOptionsCheckbox(description,point){
	idOptions = idOptions + 1;

	let containerInput = document.createElement('input');
	let label = document.createElement('label');
	containerInput.setAttribute('type','checkbox');
	containerInput.setAttribute('id',[idAnswer]+[idOptions]);
	containerInput.setAttribute('value',description);
	containerInput.setAttribute('name','description'+[idCekCheckbox]);
	label.appendChild(containerInput);
	label.innerHTML += description;
	score = score + point;

	linebreak = document.createElement("br");

	let section = document.getElementById('listsOfCheckboxOptions'+[idCekCheckbox]);
	section.appendChild(label);
	section.appendChild(linebreak);
};

async function answerQuestions(){

	let data = await fetch(`${url}/private/getQuestions`,{
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode:"cors",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('token'),
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify({
      "questionnaire_id":localStorage.getItem('answererQuestionnaireId'),
    }),
   });
   let hasil = await data.json();
   console.log(hasil);
   let result = hasil.message.questions;
   for(let i=0;i<result.length;i++){
   	let answersRadio =[];
	let answersCheckbox =[];
   	if(result[i].type === "text"){
   	let hasilText = document.getElementById('text'+[i+1]);
   		const answers = {
   			question_id: i,
   			answer: [hasilText.value],
   		}
   	answerLists.push(answers);
   	}

   	if(result[i].type === "radio"){
   		const jawabanRadio = {
   			question_id:i,
   			answer: answersRadio,
   		}
   		for(let j=0;j<result[i].options.length;j++){
   			if(document.getElementById([i+1]+[j+1]).checked){
	   				answersRadio.push(j);
	   		}
   		}
   	answerLists.push(jawabanRadio);
   	}

   	if(result[i].type === "checkbox"){
   		const jawabanCheckbox = {
   			question_id:i,
   			answer: answersCheckbox,
   		}
   		for(let j=0;j<result[i].options.length;j++){
   			if(document.getElementById([i+1]+[j+1]).checked){
	   				answersCheckbox.push(j);
	   		}
   		}
   	answerLists.push(jawabanCheckbox);
   	}

   }
   console.log(JSON.stringify(answerLists));
	let responses = await fetch(`${url}/public/answer`, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode:"cors",
    headers: {
      'Content-Type': 'application/json',
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify({
      "questionnaire_id": localStorage.getItem('answererQuestionnaireId'),
      "answerer_name": localStorage.getItem('answererName'),
      "answerer_email": localStorage.getItem('answererEmail'),
      "answerer_company": localStorage.getItem('answererCompany'),
      "answers":answerLists,
    }),
  });
  let resps = await responses.json();
  console.log(resps);
  console.log(JSON.stringify({
      "questionnaire_id": localStorage.getItem('answererQuestionnaireId'),
      "answerer_name": localStorage.getItem('answererName'),
      "answerer_email": localStorage.getItem('answererEmail'),
      "answerer_company": localStorage.getItem('answererCompany'),
      "answers":answerLists,
    }));
   let urlPart1 = window.location.href.split("/");
    window.location = urlPart1.splice(0, urlPart1.length - 1).join("/") + "/answer.html";
}