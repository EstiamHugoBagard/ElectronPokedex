import React from 'react';
import './styles/App.css';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { CardActions } from '@mui/material';

export const Pokemons = () => {

    const [pokemons, setPokemon] = React.useState([]);
    const [pokemonDetails, setPokemonDetails] = React.useState([]);
    const [myTeam, setMyTeam] = React.useState([]);

    React.useEffect(() => {
        GetPokemon('https://pokeapi.co/api/v2/pokemon');
        GetPokemonDetails('https://pokeapi.co/api/v2/pokemon/1')
    }, [])

    function GetPokemon(url) {
        fetch(url)
            .then(response => {
                response.json()
                    .then(jsonResult => {
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

    const loadStorage = () => {
        const team = JSON.parse(localStorage.getItem('my-Team')) || []
        setMyTeam(team);
    }

    const saveStorage = () => {
        localStorage.setItem('my-Team', JSON.stringify(myTeam))
    }

    const addToTeam = (pokemon) => {
        myTeam.push(pokemon)
        saveStorage()
        loadStorage()
    }

    const removeToTeam = (pokemonToRemove) => {
        console.log(pokemonToRemove)
        let pokemonIndex = myTeam.findIndex(x => x.name === pokemonToRemove.name);
        console.log(pokemonIndex)
        if (pokemonIndex !== -1) {
            myTeam.splice(pokemonIndex, 1);
        }

        saveStorage()
        loadStorage()
    }

    if (pokemons.length !== 0) return (
        <div>
            <h1>My pokemon team</h1>
            {                
                myTeam.map((poke, index) => {
                    return (
                            <img id={index} src={GetPokemonImage(poke.url)}></img>

                    )
                })
            }
            <Grid container spacing={3}>
                <Grid item xs={6}>
                    <Typography style={{ textAlign: 'center' }} gutterBottom variant="h2" component="div">
                        Pokemon list
                    </Typography>
                    <Box sx={{ flexGrow: 1 }}>
                        <Grid container spacing={3}>
                            {
                                pokemons.results?.map((pokemon, index) => {
                                    return (
                                        <Grid onClick={() => {
                                            GetPokemonDetails(`https://pokeapi.co/api/v2/pokemon/` + GetPokemonId(pokemon.url))
                                        }}
                                            id={index} item xs={8} md={5} xl={4}>
                                            <Card className="card" sx={{ maxWidth: 345 }}>
                                                <Typography gutterBottom variant="h5" component="div">
                                                    #{GetPokemonId(pokemon.url)}
                                                </Typography>
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
                                                    {
                                                        myTeam.find(x => x.name === pokemon.name) ?
                                                            <Button onClick={() => {
                                                                removeToTeam(pokemon)
                                                            }}
                                                                size="small">Remove to team</Button>
                                                            :
                                                            <Button onClick={() => {
                                                                addToTeam(pokemon)
                                                            }}
                                                                size="small">Add to team</Button>
                                                    }

                                                </CardActions>
                                            </Card>

                                        </Grid>
                                    )
                                })
                            }
                        </Grid>
                    </Box>

                    <div className="container_nav_buttons">
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
                    </div>
                </Grid>
                <Grid item xs={6}>
                    {
                        pokemonDetails ?
                            <Card style={{ position: 'fixed', width: '50%' }}>
                                <Typography style={{ textAlign: 'center' }} gutterBottom variant="h2" component="div">
                                    Pokemon details
                                </Typography>
                                <Typography style={{ textAlign: 'center' }} gutterBottom variant="h3" component="div">
                                    ID : {pokemonDetails.id} {pokemonDetails.name}
                                </Typography>
                                <Grid container justifyContent="center" spacing={3}>
                                    <Grid item xs={4}>
                                        <Typography style={{ textAlign: 'center' }} variant="h4">
                                            Normal
                                        </Typography>
                                        <CardMedia
                                            component="img"
                                            alt={pokemonDetails.name}
                                            image={pokemonDetails?.sprites?.front_default}
                                        />
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Typography style={{ textAlign: 'center' }} variant="h4">
                                            Shiny
                                        </Typography>
                                        <CardMedia
                                            xs={2}
                                            component="img"
                                            alt={pokemonDetails.name}
                                            image={pokemonDetails.sprites?.front_shiny}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid container justifyContent="center" spacing={3}>
                                    <Grid item xs={4}>
                                        <h3>Types :</h3>
                                        {
                                            pokemonDetails?.types?.map((type, index) => {
                                                return (
                                                    <p id={index}>{type.type.name}</p>
                                                )
                                            })
                                        }
                                    </Grid>

                                    <Grid item xs={4}>
                                        <h3>Abilities :</h3>
                                        {
                                            pokemonDetails?.abilities?.map((ability, index) => {
                                                return (
                                                    <p id={index}>{ability.ability.name}</p>
                                                )
                                            })
                                        }
                                    </Grid>
                                </Grid>
                            </Card>
                            :
                            null
                    }
                </Grid>
            </Grid>
        </div >
    )
}