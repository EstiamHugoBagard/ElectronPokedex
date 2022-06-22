import React from 'react';
import './styles/App.css';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

export const Pokemons = () => {

    const [pokemons, setPokemon] = React.useState([]);
    const [pokemonDetails, setPokemonDetails] = React.useState([]);

    React.useEffect(() => {
        GetPokemon('https://pokeapi.co/api/v2/pokemon');
        GetPokemonDetails('https://pokeapi.co/api/v2/pokemon/1')
    }, [])

    function GetPokemon(url) {
        fetch(url)
            .then(response => {
                response.json()
                    .then(jsonResult => {
                        console.log(jsonResult)
                        setPokemon(jsonResult)
                    })
            })
    }

    const GetPokemonDetails = (url) => {
        fetch(url)
            .then(response => {
                response.json()
                    .then(jsonResult => {
                        setPokemonDetails(jsonResult)
                        console.log(jsonResult)
                    })
            })
    }

    const GetPokemonId = (url) => {
        const pokemonUrlSplit = url.split('/')
        return pokemonUrlSplit[pokemonUrlSplit.length - 2]
    }

    const GetPokemonImage = (url) => {
        let id = GetPokemonId(url)
        return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
    }

    if (pokemons.length !== 0) return (
        <div>
            <Grid container spacing={3}>
                <Grid item xs={6}>
                    <h2>Pokemon list</h2>
                    <div className='Pokemons_container'>
                        <Box sx={{ flexGrow: 1 }}>
                            <Grid container spacing={3}>
                                {
                                    pokemons.results?.map((pokemon, index) => {
                                        return (
                                            <Grid onClick={() => {
                                                GetPokemonDetails(`https://pokeapi.co/api/v2/pokemon/` + GetPokemonId(pokemon.url))
                                            }}
                                                id={index} item xs={8} md={5} xl={4}>
                                                <Card sx={{ maxWidth: 345 }}>
                                                    <CardMedia
                                                        component="img"
                                                        alt={pokemon.name}
                                                        image={GetPokemonImage(pokemon.url)}
                                                    />
                                                    <CardContent>
                                                        <Typography gutterBottom variant="h5" component="div">
                                                            {pokemon.name}
                                                        </Typography>
                                                    </CardContent>
                                                    <CardActions>
                                                        <Button size="small">Détails</Button>
                                                    </CardActions>
                                                </Card>

                                            </Grid>
                                        )
                                    })
                                }
                            </Grid>
                        </Box>
                    </div>
                </Grid>
                <Grid item xs={6}>
                    <h1>Pokemon details</h1>
                    {
                        pokemonDetails !== null ?
                            <Card>
                                <Grid container justifyContent="center" spacing={3}>
                                    <Grid item xs={4}>
                                        {
                                            pokemonDetails?.sprites.front_default !== null ?
                                                <div>
                                                    <CardMedia
                                                        component="img"
                                                        alt={pokemonDetails.name}
                                                        image={pokemonDetails.sprites.front_default}
                                                    />
                                                    <h4>Normal</h4>
                                                </div>
                                                :
                                                null
                                        }

                                    </Grid>
                                    <Grid item xs={4}>
                                        {
                                            pokemonDetails?.sprites.front_shiny !== null ?
                                                <div>
                                                    <CardMedia
                                                        component="img"
                                                        alt={pokemonDetails.name}
                                                        image={pokemonDetails.sprites.front_shiny}
                                                    />
                                                    <h4>Shiny</h4>
                                                </div>
                                                : null
                                        }
                                    </Grid>
                                </Grid>
                                <Typography gutterBottom variant="h4" component="div">
                                    {pokemonDetails.name}
                                </Typography>
                                <h3>Types :</h3>
                                {
                                    pokemonDetails.types.length > 1 ?
                                        <h3>Types :</h3>
                                        :
                                        <h3>Type : </h3>
                                }
                                {
                                    pokemonDetails?.types.map((type, index) => {
                                        return (
                                            <p id={index}>{type.type.name}</p>
                                        )
                                    })
                                }
                            </Card>

                            :
                            null
                    }
                </Grid>
            </Grid>



            {
                pokemons?.previous ?
                    <Button
                        onClick={() => {
                            GetPokemon(pokemons.previous)
                        }}
                        variant="outlined">Previous</Button>
                    :
                    <Button
                        disabled
                        onClick={() => {
                            GetPokemon(pokemons.previous)
                        }}
                        variant="outlined">Previous</Button>
            }
            {
                pokemons?.next ?
                    <Button
                        onClick={() => {
                            GetPokemon(pokemons.next)
                        }}
                        variant="outlined">Next</Button>
                    :
                    <Button
                        disabled
                        onClick={() => {
                            GetPokemon(pokemons.next)
                        }}
                        variant="outlined">Next</Button>
            }
        </div >
    )
}