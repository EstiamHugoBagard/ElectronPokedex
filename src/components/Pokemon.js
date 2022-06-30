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
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export const Pokemons = () => {

    const [pokemons, setPokemon] = React.useState([]);
    const [pokemonDetails, setPokemonDetails] = React.useState([]);
    const [myTeam, setMyTeam] = React.useState([]);
    const [isTeamComplete, setTeamComplete] = React.useState(false);

    const [isAlertOpen, setOpenAlert] = React.useState(false);
    const [alertType, setAlertType] = React.useState("");
    const [alertMessage, setAlertMessage] = React.useState("");

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
        if (team.length >= 6) {
            setTeamComplete(true);
        } else {
            setTeamComplete(false);
        }
        setMyTeam(team);
    }

    const saveStorage = () => {
        localStorage.setItem('my-Team', JSON.stringify(myTeam))
    }

    const addToTeam = (pokemon) => {
        if (!isTeamComplete) {
            myTeam.push(pokemon)
            saveStorage()
            let successMessage = pokemon.name + 'has been added to team'
            openAlert("success", successMessage)
        } else {
            openAlert("error", "can't add more than 6 pokemon")
        }
        loadStorage()
    }

    const removeToTeam = (pokemonToRemove) => {
        let pokemonIndex = myTeam.findIndex(x => x.name === pokemonToRemove.name);
        if (pokemonIndex !== -1) {
            myTeam.splice(pokemonIndex, 1);
        }
        saveStorage()
        loadStorage()
        let successMessage = pokemonToRemove.name + 'has been remove from team'
        openAlert("success", successMessage)
    }

    const openAlert = (alertType, alertMessage) => {
        setOpenAlert(true);
        setAlertType(alertType);
        setAlertMessage(alertMessage);
    };

    const closeAlert = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenAlert(false);
    };

    if (pokemons.length !== 0) return (
        <div>
            <Snackbar open={isAlertOpen} autoHideDuration={6000} onClose={closeAlert}>
                <Alert onClose={closeAlert} severity={alertType} sx={{ width: '100%' }}>
                    {alertMessage}
                </Alert>
            </Snackbar>
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
                                        <h3>Stats</h3>
                                        {
                                            pokemonDetails?.stats?.map((stat, index) => {
                                                return (
                                                    <p id={index}>{stat.stat.name} : {stat.base_stat}</p>
                                                )
                                            })
                                        }
                                    </Grid>
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