$(document).on('click', '.tdAddQuestions', function() {
  const id = $(this).data('id');
  let item = items.find(x => x.id === id);
  const questions = {
    questionnaire_id: string,
    questions: 
    [
        {
			question_description:item.question_description,
			type: item.type,
			isrequired: item.isrequired,
			options?: 
		},
    [
        {
            description: item.description,
            score: item.score,
        },
        {
            description: item.description,
            score: item.score,
        }
    ]
},
{
	question_description:item.question_description,
	type: item.string
	isrequired: item.isrequired,
	options?: 
	[
        {
            description: item.description,
            score: item.score,
        },
        {
            description: item.description,
            score: item.score,
        }
	]
	},
        ]
    }

  }
  totalItem += 1;
  cashier.push(itemQuestions);
  createDivQuestions(itemQuestions);
});