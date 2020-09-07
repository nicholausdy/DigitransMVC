var url = "http://206.189.153.47:2020";
var idAnswer = 0;
var score = 0;
var idCekText = 0;
var idCekRadio = 0;
var idCekCheckbox = 0;


async function isiDeskripsiQuestionnaire(){
	let titleElem = document.getElementById('getQuestionnaireTitle');
	let descriptionElem = document.getElementById('getQuestionnaireDescription');

	titleElem.innerText = localStorage.getItem('questionnaireTitle');
	descriptionElem.innerText = localStorage.getItem('questionnaireDescription');
}
async function createContainerText(description){
	idAnswer += 1;

	let descriptionCell = document.createElement('div');

	let answerCell = document.createElement('div');
	
	let descriptions = document.createTextNode(description);

	let answer = document.createElement('input');
	answer.setAttribute('id','textAnswer'+[idAnswer]);

	descriptionCell.appendChild(descriptions);
	answerCell.appendChild(answer);

	let container = document.createElement('div');
	container.setAttribute('style','margin:3%');
	container.appendChild(descriptionCell);
	container.appendChild(answerCell);

	let section = document.getElementById('listAnswers');
	section.appendChild(container);
};

async function createContainerRadio(description,point,length){
	idAnswer += 1;

	idCekRadio += 1;

	let descriptionCell = document.createElement('div');

	let answerCell = document.createElement('form');
	answerCell.setAttribute('id','listsOfRadioOptions'+[idCekRadio]);

	let container = document.createElement('div');
	container.setAttribute('style','margin:3%');

	let descriptions = document.createTextNode(description);

	descriptionCell.appendChild(descriptions);

	container.appendChild(descriptionCell);

	container.appendChild(answerCell);


	let section = document.getElementById('listAnswers');
	section.appendChild(container);
};

async function createContainerCheckbox(description,point,length){
	idAnswer += 1;

	idCekCheckbox += 1;

	let descriptionCell = document.createElement('form');

	let answerCell = document.createElement('form');
	answerCell.setAttribute('id','listsOfCheckboxOptions'+[idCekCheckbox]);

	let container = document.createElement('div');
	container.setAttribute('style','margin:3%');

	let descriptions = document.createTextNode(description);

	descriptionCell.appendChild(descriptions);

	container.appendChild(descriptionCell);

	container.appendChild(answerCell);

	let section = document.getElementById('listAnswers');
	section.appendChild(container);
};

async function createOptionsRadio(description,point){
	let containerInput = document.createElement('input');
	let label = document.createElement('label');
	containerInput.setAttribute('type','radio');
	containerInput.setAttribute('id',description);
	containerInput.setAttribute('value',description);
	containerInput.setAttribute('name',description);
	label.appendChild(containerInput);
	label.innerHTML += description;
	score = score + point;

	let section = document.getElementById('listsOfRadioOptions'+[idCekRadio]);
	section.appendChild(label);
}

async function createOptionsCheckbox(description,point){
	let containerInput = document.createElement('input');
	let label = document.createElement('label');
	containerInput.setAttribute('type','checkbox');
	containerInput.setAttribute('id',description);
	containerInput.setAttribute('value',description);
	containerInput.setAttribute('name',description);
	label.appendChild(containerInput);
	label.innerHTML += description;
	score = score + point;

	let section = document.getElementById('listsOfCheckboxOptions'+[idCekCheckbox]);
	section.appendChild(label);
};

async function answerQuestions(){
	
}