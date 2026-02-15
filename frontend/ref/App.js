import './App.css';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Footer from './pages/Footer';
import Menu from './pages/Menu';
import About from './pages/About';
import Contact from './pages/Contact'

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar /> {/*navbar and footer will always render and the stuff in between will change with route*/}
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/menu" element={<Menu/>}/>
          <Route path='/about' element={<About/>}/>
          <Route path='/contact' element={<Contact/>}/>
        </Routes>
        <Footer/>
      </Router>
    </div>
  );
}

export default App;
