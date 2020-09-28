var url = "http://206.189.153.47:2020";

async function getScore(id){
	let urlPart1 = window.location.href.split("/");
    window.location = urlPart1.splice(0, urlPart1.length - 1).join("/") + "/getScore.html";
    window.localStorage.setItem("id_kuesioner",id);
};

async function loadScore(){
	let response = await fetch(`${url}/private/getScores`,{
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode:"cors",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('token'),
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify({
      "questionnaire_id":localStorage.getItem("id_kuesioner"),
    }),
  });
  let data = await response.json();
  console.log(data);
  let items = data.message;
  let result = items.scores;
  console.log(result);
  let i=1;
  for(let item of result){
  	createDivScore(i,item.answerer_email,item.total_score);
  	i++;
  };
};

async function createDivScore(no,email,score){
	let numCell = document.createElement('td');
	numCell.innerText = no;

	let emailCell = document.createElement('td');
	emailCell.innerText = email;

	let scoreCell = document.createElement('td');
	scoreCell.innerText = score;
  	
	let row = document.createElement('tr');
	row.appendChild(numCell);
	row.appendChild(emailCell);
	row.appendChild(scoreCell);

	let table = document.getElementById('listOfScores');
	table.appendChild(row);
}