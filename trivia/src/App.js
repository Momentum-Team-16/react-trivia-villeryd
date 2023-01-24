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

  return (
    <div className='category-list'>
      <ul className='wrapper'>
       
        {categories.map((cat) => (<li className='category' key={cat.id}>{cat.name}</li>
        ))}
         
      </ul>
      

    </div>
  )
}

export default App;
