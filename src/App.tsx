import { FormProvider } from 'antd/lib/form/context';
import React from 'react';
import './App.css';
import { AccessToken } from './components/AccessToken';



function App() {

  return (
    <div className="App">
      <body className="App-body">
        <AccessToken />
      </body>
    </div>
  );
}

export default App;
