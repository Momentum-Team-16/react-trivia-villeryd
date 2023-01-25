import './App.css';
import { useState, useEffect } from 'react'
import axios from 'axios';



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

    console.log(selectedCat)
  
    return <CatQuestion />
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


function CatQuestion(selectedCat) {
  const [que, setQuestion] = useState([])
  console.log(`cat id is ${selectedCat}`)
  useEffect(() => {
    axios
    .get(`https://opentdb.com/api.php?amount=1&category=9`)
    .then((response) =>{setQuestion(response.data.results.map(obj => [obj.question, obj.incorrect_answers, obj.correct_answer]))
    })
    
  },[selectedCat])

  

  return (
    <div className='question'>
      
      {que.map((q) =>

        (
      <div>
        <h1 key={selectedCat}>{q[0].replace('&quot;','"').replace('&quot;','"')}</h1>
      <ul className='questions'>
      <li className='category'>{q[1][0]}</li>
      <li className='category'>{q[1][1]}</li>
      <li className='category'>{q[1][2]}</li>
      <li className='category'>{q[2]}</li>
      </ul>
      </div>)
   
        )}
  </div>
  )

      }

export default App;
