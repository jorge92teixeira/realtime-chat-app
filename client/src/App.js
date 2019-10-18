import React from 'react'
import { BrowserRouter, Route } from 'react-router-dom';

const App = () => {
  return (
    <BrowserRouter>
      <Route path='/' exact component={Join} />
      <Route path='/chat' exact component={Chat} />
    </BrowserRouter>
  )
}

export default App;
