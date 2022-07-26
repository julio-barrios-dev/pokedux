import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getPokemon, getPokemonDetails } from '../api/index'
import { setLoading, setNotFound } from './uiSlice'; 

const initialState = {
  pokemons: []
};

export const fetchPokemonWithDetails = createAsyncThunk(
  'data/fetchPokemonWithDetails',
  async (_, {dispatch}) => { //El primer parametro se usa si necesitamos algo especifico 
    dispatch(setLoading(true));
    const pokemonRes = await getPokemon();
    const pokemonsDetailed = await Promise.all(
      pokemonRes.map(pokemon => getPokemonDetails(pokemon)));
      dispatch(setPokemons(pokemonsDetailed));
      dispatch(setLoading(false));
  }
);
export const getSearch = (namePoke) => (dispatch, getState) => {
    const { data: { pokemons }, ui} = getState()
    if (namePoke === '') {
      dispatch(setNotFound(false))
      dispatch(fetchPokemonWithDetails())
      return null
    }
    
    const currentPokedemonIndex = pokemons.findIndex((pokemon) => {
      return pokemon.name === namePoke;
    }
    );
    if (currentPokedemonIndex >= 0) {
      dispatch(setNotFound(false))
      dispatch(setPokemons([pokemons[currentPokedemonIndex]]))

      return null;
    }
    dispatch(setNotFound(true))
  };

export const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    setPokemons: (state, action) => {
      state.pokemons = action.payload;
    },
    setFavorite: (state, action) => {
      const currentPokedemonIndex = state.pokemons.findIndex((pokemon) => {
          return pokemon.id === action.payload.pokemonId;
        }
      );
      if (currentPokedemonIndex >= 0) {
        const isFavorite = state.pokemons[currentPokedemonIndex].favorite;

        state.pokemons[currentPokedemonIndex].favorite = !isFavorite;
      }
    }
  },
});

export const { setFavorite, setPokemons } = dataSlice.actions;

export default dataSlice.reducer;