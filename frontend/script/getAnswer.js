var url = "http://206.189.153.47:2020";

async function getAnswer(){
	
	let response = await fetch(`${url}/private/getAnswer`,{
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode:"cors",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('token'),
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify({
      "questionnaire_id":localStorage.getItem("showQuestionnaireId"),
      "answerer_email":localStorage.getItem("showAnswererEmail")
    }),
  });
  let data = await response.json();
  console.log(data);
  let item = data.message;
  window.localStorage.setItem('showAnswererName',item.answerer_name);
  window.localStorage.setItem('showAnswererCompany',item.answerer_company);
};

async function createAnswerDetails(questionnaireId){
	let numCell = document.createElement('td');
	numCell.innerText = i;

	let questionnaireTitleCell = document.createElement('td');

  	textQuestionnaireTitle = document.createTextNode(questionnaireTitle);
   
	let questionnaireDescriptionCell = document.createElement('td');
	questionnaireDescriptionCell.innerText = questionnaireDescription;

	let chartCell = document.createElement('td');
	chartCell.setAttribute('style','cursor:pointer');
	chartCell.innerHTML = `<span class="label label-info pull-left" >See Chart</span>`

	questionnaireTitleCell.appendChild(textQuestionnaireTitle);

	chartCell.addEventListener('click', () => getDetailsChart(questionnaireId));
	  	
	let row = document.createElement('tr');
	row.appendChild(numCell);
	row.appendChild(questionnaireTitleCell);
	row.appendChild(questionnaireDescriptionCell);
	row.appendChild(chartCell);

	let table = document.getElementById('questionnaireChart');
	table.appendChild(row);
};

async function getAnswererDetails(){
	let nameElem = document.getElementById('getAnswererName');
	let companyElem = document.getElementById('getAnswererCompany');

	nameElem.innerText = localStorage.getItem('showAnswererName');
	companyElem.innerText = localStorage.getItem('showAnswererCompany');
}