var url = "http://206.189.153.47:2020";

async function createRowChart(i,questionnaireTitle,questionnaireDescription,questionnaireId){
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

async function getDetailsChart(questionnaireID){
  window.localStorage.setItem('questionnaireId',questionnaireID);
  let urlPart1 = window.location.href.split("/");
  window.location = urlPart1.splice(0, urlPart1.length - 1).join("/") + "/chart.html";
}

async function loadQuestionnairesChart(){
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
  	createRowChart(i,item.QuestionnaireTitle,item.QuestionnaireDescription,item.QuestionnaireId);
  	i++;
  }
};

async function getChart(){
	let testing = localStorage.getItem('questionnaireId');
	console.log(testing);
	let response = await fetch(`${url}/private/getChart`,{
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode:"cors",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('token'),
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify({
      "questionnaire_id":testing,
        "question_id":1
    }),
  });
  let resulting = await response;
  console.log(resulting);

  let component = document.createElement("div");

  let output = await response.text();

  const objectURL = window.URL.createObjectURL(output);

  component.appendChild(objectURL);

  let graphAnswer = document.getElementById('graph');
  graphAnswer.appendChild(component);
};

async function createChart(){
  let component = document.createElement("div");



  const objectURL = window.URL.createObjectURL(`${url}/private/getChart`);

  component.appendChild(objectURL);

  let graphAnswer = document.getElementById('graph');
  graphAnswer.appendChild(component);
};