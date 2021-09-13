import ReactDOM from 'react-dom';
import { AuthContextProvider } from './contextStore/auth-context';
import { BrowserRouter } from 'react-router-dom';

import './index.css';
import App from './App';

ReactDOM.render(
  <AuthContextProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </AuthContextProvider>,
  document.getElementById('root')
);
