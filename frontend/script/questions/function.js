const createDivQuestions = () => {
  content = `<div id="questions">
    <img style="margin-left:5%" class="inline-block" alt="">
    <p class="inline-block">${itemquestions.name}</p>
    <button type="button" data-id="${itemquestions.id}" class="btnMinQuantity" name="button" style="width:20px; height:20px; background-color:#43B4FF">-</button>
    <input id="quantity-${itemquestions.id}" type="text" value="${itemquestions.quantity}" style="margin-left:20px; margin-right:20px;padding-left:5%;width:30px;border:0">
    <button type="button" data-id="${itemquestions.id}" class="btnAddQuantity" name="button" style="width:20px; height:20px; background-color:#43B4FF">+</button>
    <span id="Itemquestions-${itemquestions.id}">${itemquestions.}</span>
  </div>`;

  content = `<div id="itemquestions-${itemquestions.id}">
    <img class="inline-block" src="Rectangle 792.png" alt="">
    <p style="margin-right:2%" class="inline-block" id="namaQuestions">${itemquestions.name}</p>
    <button type="button" data-id="${itemquestions.id}" class="btnMinQuantity" name="button" style="width:20px; height:20px; background-color:#43B4FF">-</button>
    <input id="quantity-${itemquestions.id}" type="text" value="${itemquestions.quantity}" style="width:10px;padding-left:1%;border:0;margin-left:20px; margin-right:20px;">
    <button type="button" data-id="${itemquestions.id}" class="btnAddQuantity" name="button" style="width:20px; height:20px; background-color:#43B4FF">+</button>
    <span id="Itemquestions-${itemquestions.id}">${itemquestions.}</span>
  </div>`;

  if (questions.length === 1) {
    contentSummary = `
    <input style="margin:3%;padding-left:5%;width:50%;height:35px" ></input>
    <button style="background: #43B4FF;border-radius: 5px;width: 64px;height: 35px" type="button" name="button">Check</button>
    <div id="summaryquestions" style="border-top:1px solid black;margin-top:10%">
      <div class="row" style="display:inline-block;margin-left:5%">
        <p style="font-family:Open Sans;font-weight:bold;font-size:12px;letter-spacing:-0.02em">Total <p style="font-family:Open Sans;font-weight:bold;font-size:16px;letter-spacing:0.02em;color:#43B4FF" id="total">0</p></p>
      </div>
        <button style="display:inline-block;width:97px;height:33px;border-radius:5px;float:right;color: #FFFFFF;font-size:14px;font-family:lato;background: #43B4FF" type="button" name="button" id="btnCheckout">Checkout</button>
      </div>
    </div>`
    $('#questions').append(contentSummary)


    buttonProceedPayQ= `
    <button style="width: 426px;height: 43px;background: #43B4FF;border-radius: 6px;margin-left:5%;margin-top:20%;font-family:Lato;font-style:normal;font-weight:bold;font-size:16px;line-height:19px;margin-bottom:3%;text-align:center;color: #FFFFFF" type="button" name="button" id="btnCheckout">Proceed PayQ/button>
    `

    $('#questionsCheckoutKiri').append(contentSummary);
    $('#questionsCheckoutKanan').append(buttonProceedPayQ;
  }
  updateTotal();
  $(content).insertBefore('#summaryquestions');
  $(content).insertBefore('#summaryquestions');
};
