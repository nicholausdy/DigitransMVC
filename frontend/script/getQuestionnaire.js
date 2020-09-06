var url = "http://206.189.153.47:2020";

async function createRow(i,questionnaireTitle,questionnaireDescription,questionnaireId){
	let numCell = document.createElement('td');
	numCell.innerText = i;

	let questionnaireTitleCell = document.createElement('td');
	questionnaireTitleCell.innerText = questionnaireTitle;

	let questionnaireDescriptionCell = document.createElement('td');
	questionnaireDescriptionCell.innerText = questionnaireDescription;

	let questionnaireIdCell = document.createElement('td');
	questionnaireIdCell.innerText = questionnaireId;

	let detailCell = document.createElement('td');
	detailCell.setAttribute('style','cursor:pointer');
	detailCell.innerHTML = `<span class="label label-info pull-left" >detail</span>`

	let editCell = document.createElement('td');
	editCell.innerHTML = `<span class="label label-info pull-left" >edit</span>`

	let hapusCell = document.createElement('td');
	hapusCell.innerHTML = `<span class="label label-danger pull-left">hapus</span>`

	detailCell.addEventListener('click', () => getDetails(questionnaireId));
	//editCell.addEventListener('click', () => getUpdate(idKelas));

	
	let row = document.createElement('tr');
	row.appendChild(numCell);
	row.appendChild(questionnaireTitleCell);
	row.appendChild(questionnaireDescriptionCell);
	row.appendChild(questionnaireIdCell);
	row.appendChild(detailCell);
	row.appendChild(editCell);
	row.appendChild(hapusCell);

	let table = document.getElementById('listOfQuestionnaires');
	table.appendChild(row);
}

async function getDetails(questionnaireID){
	window.localStorage.setItem('questionnaireId',questionnaireID);
	loadQuestions();
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
	let questionnaireId = localStorage.getItem('questionnaireId');

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
}