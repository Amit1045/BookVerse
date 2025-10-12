import BookDetail from '../Components/BookDetail';
import LandingPage from '../Components/LandingPage';
import './App.css'
import { Routes, Route } from 'react-router-dom';

function App() {

  return (
    <div>
        <Routes>
          <Route path='/' element={<LandingPage/>} />
          <Route path='/detail' element={<BookDetail/>} />
        </Routes>
      </div>
  )
}

export default App
