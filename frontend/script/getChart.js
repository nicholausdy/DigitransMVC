var url = "http://206.189.153.47:2020";

var svgNS = "http://www.w3.org/2000/svg";  

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
        "question_id":2
    }),
  });
  console.log(response);
  return response;
};

async function createChart(){
  let component = document.createElement("div");

  const objectURL = window.URL.createObjectURL("http://206.189.153.47:2020/private/getChart");

  component.appendChild(objectURL);

  let graphAnswer = document.getElementById('mySVG');
  graphAnswer.appendChild(component);
};

function createCircle()
{
    var myCircle = document.createElementNS(svgNS,"circle"); //to create a circle. for rectangle use "rectangle"
    myCircle.setAttributeNS(null,"id","mycircle");
    myCircle.setAttributeNS(null,"cx",100);
    myCircle.setAttributeNS(null,"cy",100);
    myCircle.setAttributeNS(null,"r",50);
    myCircle.setAttributeNS(null,"fill","black");
    myCircle.setAttributeNS(null,"stroke","none");

    document.getElementById("mySVG").appendChild(myCircle);
}; 

async function createReadableStream(response) {
    const body = response.body;
    const reader = await body.getReader();

    return new ReadableStream({
        async start(controller) {
            while (true) {
                const { done, value} = await reader.read();

                if (done) {
                    break;
                }
                controller.enqueue(value);
            }
            controller.close();
            reader.releaseLock();
        }
    })
};

async function createTempURL(response) {
    try {
        const stream = await createReadableStream(response);
        console.log(stream);
        let transformedResp =  new Response(stream);
        transformedResp = await transformedResp.blob();
        const url = URL.createObjectURL(transformedResp); 
        console.log(url)
        return url;
    } catch (error) {
        console.log(error)
    }
};

async function chartURL() {
    try {
        const response = await getChart()
        const url = await createTempURL(response)
        console.log(url);
        return url; 
    } catch (error) {
        console.log(error)
    }
};

async function renderChart(){
  const url = await chartURL();

  let data = document.createElement('object');
  data.setAttribute('type','image/svg+xml');
  data.setAttribute('data',url);

  let div = document.getElementById('graph');
  div.appendChild(data);
};