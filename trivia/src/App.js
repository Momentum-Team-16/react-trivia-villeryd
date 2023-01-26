import './App.css';
import { useState, useEffect } from 'react'
import axios from 'axios';
import he, { decode } from "he"
import shuffle from 'lodash/shuffle'



function App() {
  return (
    <div className="App">
    <Category/>
      </div>
  );
}



function Category() {
  const [categories, setCategories] = useState([])

  useEffect(() => {
    axios
      .get(`https://opentdb.com/api_category.php`)
      .then((response) => {setCategories(response.data.trivia_categories)
      })
  },[])

  const [selectedCat, setSelectedCat] = useState("")
  if (selectedCat){
    return <CatQuestion selectedCat={selectedCat}/>
  }

  return (
    <div className='category-list'>
      <ul className='wrapper'>
        {categories.map((cat) => (<li onClick ={() =>setSelectedCat(cat.id)}className='category' key={cat.id}>{cat.name}</li>
        ))}
      </ul>
    </div>
  )
}


function CatQuestion(props) {
  const [que, setQuestion] = useState([])
  const [ans, setAnswer] = useState('')
  useEffect(() => {
    axios
    .get(`https://opentdb.com/api.php?amount=1&category=${props.selectedCat}`)
    .then((response) => {
      setQuestion(response.data.results.map((obj) => ({
        question: he.decode(obj.question),
        correctAnswer: he.decode(obj.correct_answer),
        answers: shuffle([
          obj.correct_answer,
          ...obj.incorrect_answers
        ]),
      }))
    )})
    
  },[props.selectedCat])

  return (
    <div className='question'>
      {que && que.map((q) =>(
        <div>
          <h1 key={props.selectedCat}>
            {q.question}
          </h1>
          <ul className='questions'>
            
            {q.answers.map(a => (
              <li onClick ={() =>(setAnswer(he.decode(a)))} className='category'>{he.decode(a)}</li> 
              
            ))}
          </ul>
        </div>
        ))}
    </div>
  )
}

export default App;
