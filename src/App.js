import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/home/Home';
import People from './pages/people/People';
import City from './pages/city/City';
import Neighborhood from './pages/neighborhood/Neighborhood';


function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
            <Route path='/' element= {<Home />} />
            <Route path='people' element= {<People />} />
            <Route path='city' element= {<City />} />
            <Route path='neighborhood' element= {<Neighborhood />} />
        </Routes>
      </BrowserRouter>
    </>
  );

}

export default App;