import "./App.css";
import { useState, useEffect } from "react";
import axios from "axios";
import he, { decode } from "he";
import shuffle from "lodash/shuffle";

function App() {
  return (
    <div className='App'>
      <Category />
    </div>
  );
}

function Category() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios.get(`https://opentdb.com/api_category.php`).then((response) => {
      setCategories(response.data.trivia_categories);
    });
  }, []);

  const [selectedCat, setSelectedCat] = useState("");
  const [score, setScore] = useState(0);

  const updateScore = (amount) => {
    setScore(score + amount);
  };

  if (selectedCat) {
    return (
      <CatQuestion
        selectedCat={selectedCat}
        setSelectedCat={setSelectedCat}
        changeScore={updateScore}
        score={score}
      />
    );
  }

  return (
    <div className='category-list'>
      <ul className='wrapper'>
        {categories.map((cat) => (
          <li
            onClick={() => setSelectedCat(cat.id)}
            className='category'
            key={cat.id}
          >
            {cat.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

function CatQuestion({ selectedCat, setSelectedCat, changeScore, score }) {
  const [que, setQuestion] = useState([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    axios
      .get(`https://opentdb.com/api.php?amount=10&category=${selectedCat}`)
      .then((response) => {
        setQuestion(
          response.data.results.map((obj) => ({
            question: he.decode(obj.question),
            correctAnswer: he.decode(obj.correct_answer),
            answers: shuffle([obj.correct_answer, ...obj.incorrect_answers]),
          }))
        );
      });
  }, [selectedCat]);

  return (
    que.length > 0 && (
      <QuestionList
        question={que}
        index={index}
        setIndex={setIndex}
        changeScore={changeScore}
        score={score}
        setSelectedCat={setSelectedCat}
      />
    )
  );
}

function QuestionList({
  changeScore,
  question,
  index,
  setIndex,
  score,
  setSelectedCat,
}) {
  const [ans, setAnswer] = useState("");

  function handleClick() {
    if (he.decode(ans) === question[index].correctAnswer) {
      changeScore(100);
      console.log("success");
    }
    setIndex(index + 1);
  }

  if (question && index > question.length - 1) {
    return <EndGame score={score} setSelectedCat={setSelectedCat} />;
  }

  return (
    <div className='question'>
      <div>
        <h1 key={index}>{question[index].question}</h1>
        <ul className='questions'>
          {question[index].answers.map((a) => (
            <AnswerChoice answer={a} setAnswer={setAnswer} />
            // <li
            //   onClick={() => clickAnswer(he.decode(a))}
            //   className={` ${isActive ? "category" : "bold"}`}
            // >
            //   {he.decode(a)}
            // </li>
          ))}
        </ul>
        <button onClick={() => handleClick()}>submit</button>
      </div>
    </div>
  );
}
function AnswerChoice({ answer, setAnswer }) {
  const [isActive, setActive] = useState(false);
  function clickAnswer(a) {
    setAnswer(a);
    setActive(!isActive);
  }
  return (
    <>
      <li
        onClick={() => clickAnswer(he.decode(answer))}
        className={` ${isActive ? "bold" : "category"}`}
      >
        {he.decode(answer)}
      </li>
    </>
  );
}
function EndGame({ score, setSelectedCat }) {
  return (
    <div>
      <h1>Congrats you made it to the end!</h1>
      <p>score = {score}</p>
      <button onClick={() => setSelectedCat(null)}>Play again</button>
    </div>
  );
}

export default App;
