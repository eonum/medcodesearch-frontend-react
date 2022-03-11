import logo from './logo.svg';
import './App.css';
import Button from 'react-bootstrap/Button';
import Footer from './Components/Footer/footer';
import Header from './Components/Header/header';
import Main from './Components/Main/Main';

function App() {
  return (
    <div className="App">
        <Header/>
        <Main />
        <Footer/>
    </div>
  );
}

export default App;
