import React from 'react';
import './styles/App.css';
import { Pokemons } from './Pokemon';
import Grid from '@mui/material/Grid';

const App = () => {

  return (
    <div className="App">
      <h1>Hugo's pokedex</h1>
      <hr />
      <Pokemons></Pokemons>

    </div>
  )
}
export default App;