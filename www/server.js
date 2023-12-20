import express from "express";
import Words from "./models/words.js";
const app = express();
app.use(express.static("public"));

app.set("view engine","ejs");
app.use(express.urlencoded({extended:true}));


app.use(express.static('public'));


class Question {
    constructor(word, trad) {
      this.word = word;
      this.trad = trad;
    }
}
class Attempts {
    constructor(attempts,success) {
        this.attempts = attempts;
        this.success = success;
    }
}

async function loadDataAnswer(response,lastAnswer,oldQuestionData){

    oldQuestionData.success = oldQuestionData.success + 1;
    oldQuestionData.attempts = oldQuestionData.attempts + 1;
    //await oldQuestionData.update(oldQuestionData);
    //await oldQuestionData.save();
    const vocabulary = await Words.loadMany();
    console.log(vocabulary);
    const newAnswerId = getRandomId(vocabulary);
    const newQuestionData = await Words.loadMany({id:newAnswerId});
    console.log('new question data:');
    console.log(newQuestionData);
    let newQuestion = new Question(newQuestionData[0].word,newQuestionData[0].trad);
    console.log(newQuestion)
    let attemptsData = new Attempts(newQuestionData[0].attempts,newQuestionData[0].success); 
    response.render('home.ejs',{lastAnswer,newQuestion,attemptsData})
}


//le truc de overflow sur recup un elem de la liste random
function getRandomId(listVoc) {
    for (let i = listVoc.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [listVoc[i], listVoc[j]] = [listVoc[j], listVoc[i]];
    }
    return listVoc[0].id;//return le id de lelem random
}
  


// app.post('/',async function (request,response){

//     if (request.body.something != null){
//         //do something
//     }
// })


app.post('/try/',async function (request,response){
    if (request.body.answer != null){
        //do something
        let oldQuestionData = await Words.loadMany({word:request.body.word})
        let oldQuestion = new Question(oldQuestionData[0].word,oldQuestionData[0].trad)
        if (request.body.answer == oldQuestion.trad)
        {
            const lastAnswer = "en effet la traduction de " + String(oldQuestion.word) + " est bel et bien " + String(oldQuestion.trad);
            //bonne reponse
            loadDataAnswer(response,lastAnswer,oldQuestionData);
            
        }
        else
        {
            //mauvaise reponse
            const lastAnswer = "et non, la traduction de "  + String(oldQuestion.word) + " etait "+ String(oldQuestion.trad);
            loadDataAnswer(response,lastAnswer,oldQuestionData);
        }
        
    }
    else
    {
        response.redirect('/');
    }
})

app.get('/voc/',async function (request,response){
    //the add voc base page
    //afficher tout le tableau
    const vocabulary = await Words.loadMany();
    response.render("addVoc.ejs",{vocabulary});
})

app.get('/voc/addVoc',async function (request,response){
    if (request.query.something != null){
        //do something
        let newQuestion = Question(request.query.word,request.query.trad);
        let word = await Words.update(Question);
        await word.save();
    }
    response.redirect('/voc/');

})
app.get('/deleteVoc',async function (request,response){
    if (request.query.something != null){
        //do something
        Words.delete({id:request.query.id});
    }
    response.redirect('/voc/');
})

app.get('/',async function (request,response){
    //the answer page
    const lastAnswer = "";
    const vocabulary = await Words.loadMany();
    console.log(vocabulary);
    const newAnswerId = getRandomId(vocabulary);
    const newQuestionData = await Words.loadMany({id:newAnswerId});
    console.log('new question data:');
    console.log(newQuestionData);
    let newQuestion = new Question(newQuestionData[0].word,newQuestionData[0].trad);
    console.log(newQuestion)
    let attemptsData = new Attempts(newQuestionData[0].attempts,newQuestionData[0].success); 
    response.render("home.ejs",{lastAnswer,newQuestion,attemptsData});
})



app.listen(80, function(){
    console.log("Server ok");
});




