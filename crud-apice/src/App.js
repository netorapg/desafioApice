import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/home/Home';
import People from './pages/people/People';
import City from './pages/city/City';
import Neighborhood from './pages/neighborhood/Neighborhood';
import Product from './pages/product/Product';
import Sales from './pages/sales/Sales';
import ListPeople from './pages/report/listPeople/ListPeople';
import ListSales from './pages/report/listSales/ListSales';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
            <Route path='/' element= {<Home />} />
            <Route path='people' element= {<People />} />
            <Route path='city' element= {<City />} />
            <Route path='neighborhood' element= {<Neighborhood />} />
            <Route path='product' element= {<Product />} />
            <Route path='sales' element= {<Sales />} />
            <Route path='listPeople' element= {<ListPeople />} />
            <Route path='listSales' element= {<ListSales />} />
        </Routes>
      </BrowserRouter>
    </>
  );

}

export default App;