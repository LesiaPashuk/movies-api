import './App.css'
import { BrowserRouter, Routes, Route,Navigate } from 'react-router-dom';
import { Card } from './components/card/Card'
import { CreateCard } from './components/create-card/CreateCard'
import { CardList } from './components/list-of-cards/CardList'
import {InfoCard} from './components/infoCard/InfoCard'
function App() {

  return (
    <BrowserRouter>
    <Routes>
      <Route  path='/'  element={<CardList />}></Route>
      <Route path="/create-card" element={<CreateCard></CreateCard>}></Route>
      <Route path='/:id' element ={<InfoCard/>}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
