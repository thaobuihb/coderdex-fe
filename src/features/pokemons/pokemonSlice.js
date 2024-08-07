import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiService from "../../app/apiService";
import { POKEMONS_PER_PAGE } from "../../app/config";

export const getPokemons = createAsyncThunk(
  "pokemons/getPokemons",
  async ({ page, search, type }, { rejectWithValue }) => {
    try {
      let url = `/pokemons?page=${page}&limit=${POKEMONS_PER_PAGE}`;
      if (search)
        url = `/pokemons?page=${page}&limit=${POKEMONS_PER_PAGE}&search=${search}`;
      if (type)
        url = `/pokemons?page=${page}&limit=${POKEMONS_PER_PAGE}&type=${type}`;
      const response = await apiService.get(url);
      const timeout = () => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve("ok");
          }, 1000);
        });
      };
      await timeout();
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getPokemonById = createAsyncThunk(
  "pokemons/getPokemonById",
  async (id, { rejectWithValue }) => {
    try {
      let url = `/pokemons/${id}`;
      const response = await apiService.get(url);
      if (!response) return rejectWithValue({ message: "No data" });
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const addPokemon = createAsyncThunk(
  "pokemons/addPokemon",
  async ({ name, imgUrl, types }, { rejectWithValue }) => {
    try {
      let url = "/pokemons";
      await apiService.post(url, { name, url: imgUrl, types });
      const response = await apiService.get(url);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const editPokemon = createAsyncThunk(
  "pokemons/editPokemon",
  async ({ name, id, url, types }, { rejectWithValue, dispatch }) => {
    try {
      let fetchedUrl = `/pokemons/${id}`;
      const response = await apiService.put(fetchedUrl, {
        name,
        url,
        types,
        id,
      });
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deletePokemon = createAsyncThunk(
  "pokemons/deletePokemon",
  async (id, { rejectWithValue }) => {
    try {
      let url = `/pokemons/${id}`;
      const response = await apiService.delete(url);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const pokemonSlice = createSlice({
  name: "pokemons",
  initialState: {
    isLoading: false,
    pokemons: [],
    pokemon: {
      currentPokemon: null,
      nextPokemon: null,
      previousPokemon: null,
    },
    pokemonNames: [],
    filteredData: [],
    search: "",
    type: "",
    page: 1,
  },
  reducers: {
    changePage: (state, action) => {
      if (action.payload) {
        state.page = action.payload;
      } else {
        state.page++;
      }
    },
    typeQuery: (state, action) => {
      state.type = action.payload;
    },
    searchQuery: (state, action) => {
      state.search = action.payload;
    },
  },
  extraReducers: {
    [getPokemons.pending]: (state) => {
      state.loading = true;
      state.errorMessage = "";
    },
    [getPokemons.fulfilled]: (state, action) => {
      state.loading = false;
      const { search, type } = state;
      if ((search || type) && state.page === 1) {
        state.pokemons = action.payload[0];
      } else {
        state.pokemons = [...state.pokemons, ...action.payload[0]];
        state.pokemonNames = [...action.payload[1]];
      }
    },
    [getPokemons.rejected]: (state, action) => {
      state.loading = false;
      if (action.payload) {
        state.errorMessage = action.payload.message;
      } else {
        state.errorMessage = action.error.message;
      }
    },
    [getPokemonById.pending]: (state) => {
      state.loading = true;
      state.errorMessage = "";
    },
    [getPokemonById.fulfilled]: (state, action) => {
      state.loading = false;
      const { prevPokemon, currentPokemon, nextPokemon, filteredData } =
        action.payload;
      state.pokemon.currentPokemon = currentPokemon;
      state.pokemon.previousPokemon = prevPokemon;
      state.pokemon.nextPokemon = nextPokemon;
      state.filteredData = filteredData;
    },
    [getPokemonById.rejected]: (state, action) => {
      state.loading = false;
      if (action.payload) {
        state.errorMessage = action.payload.message;
      } else {
        state.errorMessage = action.error.message;
      }
    },
    [addPokemon.pending]: (state) => {
      state.loading = true;
      state.errorMessage = "";
    },
    [addPokemon.fulfilled]: (state, action) => {
      state.loading = false;
      state.pokemonNames = [...action.payload[1]];
    },
    [addPokemon.rejected]: (state, action) => {
      state.loading = false;
      if (action.payload) {
        state.errorMessage = action.payload.message;
      } else {
        state.errorMessage = action.error.message;
      }
    },
    [deletePokemon.pending]: (state) => {
      state.loading = true;
      state.errorMessage = "";
    },
    [deletePokemon.fulfilled]: (state, action) => {
      state.loading = false;
    },
    [deletePokemon.rejected]: (state, action) => {
      state.loading = false;
      if (action.payload) {
        state.errorMessage = action.payload.message;
      } else {
        state.errorMessage = action.error.message;
      }
    },
    [editPokemon.pending]: (state) => {
      state.loading = true;
      state.errorMessage = "";
    },
    [editPokemon.fulfilled]: (state, action) => {
      state.loading = true;
      state.isLoading = true;
      state.pokemon.currentPokemon = action.payload;
    },
    [editPokemon.rejected]: (state, action) => {
      state.loading = false;
      state.isLoading = false;
      if (action.payload) {
        state.errorMessage = action.payload.message;
      } else {
        state.errorMessage = action.error.message;
      }
    },
  },
});

const { actions, reducer } = pokemonSlice;
export const { changePage, searchQuery, typeQuery } = actions;
export default reducer;
