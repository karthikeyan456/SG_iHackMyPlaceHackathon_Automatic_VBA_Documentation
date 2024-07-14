import logo from './logo.svg';
import './App.css';
import Home from './pages/Home';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import CodeAnalyze from './pages/CodeAnalyze';
import PastAnalysis from './pages/PastAnalysis';
function App() {
  return (
    <div className="App">
        <Router>
          <Switch>
              <Route path="/" exact component={Home} />
              <Route path="/codeanalyzer"  exact component={CodeAnalyze}/>
              <Route path="/prevrec"  exact component={PastAnalysis}/>
          </Switch>
        </Router>
    </div>
  );
}

export default App;
