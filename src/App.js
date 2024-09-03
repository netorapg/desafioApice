import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/home/Home';
import People from './pages/people/People';


function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
            <Route path='/' element= {<Home />} />
            <Route path='people' element= {<People />} />
        </Routes>
      </BrowserRouter>
    </>
  );

}

export default App;