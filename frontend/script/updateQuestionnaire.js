var url = "http://206.189.153.47:2020";

async function getUpdate(id,title,description){
  exampleModalCenter.style.display = "block";
  window.localStorage.setItem('questionnaireId',id);
  window.localStorage.setItem('questionnaireTitle',title);
  window.localStorage.setItem('questionnaireDescription',description);
  getUpdateData();
  console.log(id);
};

async function getUpdateData(){
	let title = localStorage.getItem('questionnaireTitle');
	let description = localStorage.getItem('questionnaireDescription');

	let titleElem = document.getElementById("editQuestionnaireTitle");
	let descriptionElem = document.getElementById("editQuestionnaireDescription");

	titleElem.value = title;
	descriptionElem.value = description;

};

async function updateQuestionnaire(){
	let titleElem = document.getElementById("editQuestionnaireTitle");
	let descriptionElem = document.getElementById("editQuestionnaireDescription");
	let idElem = localStorage.getItem('questionnaireId');

	let result = await fetch(`${url}/private/questionnaire`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('token'),
    },
    body: JSON.stringify({
	  "questionnaire_title": titleElem.value,
      "questionnaire_desc": descriptionElem.value,
      "questionnaire_id": idElem,
    }),
   });
   let resp = await result.json();
   console.log(resp);
	  
	let urlPart1 = window.location.href.split("/");
    window.location = urlPart1.splice(0, urlPart1.length - 1).join("/") + "/getQuestionnaire.html";
}