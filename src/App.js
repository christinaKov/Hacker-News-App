import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import MainPage from './components/mainPage/MainPage';
import NewsDetailPage from './components/newsDetailPage/NewsDetailPage';

function App() {
  return (
      <Router>
        <Switch>
          <Route path='/' exact component={MainPage} />
          <Route path='/:id' component={NewsDetailPage} />
        </Switch>
      </Router>
  );
}

export default App;
