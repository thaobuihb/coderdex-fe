import {
	Box,
	Button,
	CardMedia,
	Container,
	Grid,
	Stack,
	Typography,
  } from "@mui/material";
  import { useEffect, useState } from "react";
  import { useDispatch, useSelector } from "react-redux";
  import { Link, useParams } from "react-router-dom";
  import { PokeType } from "../components/PokeType";
  import { getPokemonById } from "../features/pokemons/pokemonSlice";
  import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
  import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
  import { BASE_URL } from "../app/config";
  import PokemonEdit from "../components/PokemonEdit";
  import PokemonDelete from "../components/PokemonDelete";
  
  const styles = {
	container: {
	  backgroundColor: "white",
	  backgroundImage: "url('/images/container_bg.png')",
	  pb: 5,
	},
  };
  
  export const DetailPage = () => {
	const { currentPokemon, nextPokemon, previousPokemon } = useSelector(
	  (state) => state.pokemons.pokemon
	);
	const { id } = useParams();
	const dispatch = useDispatch();
	const weaknesses = calculateWeaknesses(currentPokemon?.types);
	const [openPostEdit, setOpenPostEdit] = useState(false);
	const [openPokemonDelete, setOpenPokemonDelete] = useState(false);
  
	const formattedAbilities = () => {
	  let abilities = "";
	  currentPokemon?.abilities?.map((ability) => (abilities += ability + ", "));
	  return abilities ? abilities.slice(0, abilities.length - 2) : "Unknown";
	};
  
	const handleOpenPostEdit = () => {
	  setOpenPostEdit(true);
	};
  
	const handleOpenPokemonDelete = () => {
	  setOpenPokemonDelete(true);
	};
  
	const handleClosePostEdit = () => {
	  setOpenPostEdit(false);
	};
  
	const handleClosePokemonDelete = () => {
	  setOpenPokemonDelete(false);
	};
  
	useEffect(() => {
	  dispatch(getPokemonById(id));
	}, [id, dispatch]);
  
	return (
	  <Container maxWidth="lg" disableGutters sx={styles.container}>
		<Box position="relative">
		  <Grid container spacing={1}>
			{/* Previous pokemon */}
			<Grid item xs={6}>
			  <Box
				pt={2}
				pb={8}
				pl={3}
				className="navigation-button"
				display="flex"
				alignItems="center"
				sx={{ textDecoration: "none" }}
				component={Link}
				to={`/pokemons/${previousPokemon?.id || "1"}`}
			  >
				<ArrowBackIosNewIcon
				  sx={{
					color: "#616161",
					backgroundColor: "white",
					borderRadius: "50%",
					padding: "5px",
					mr: 2,
				  }}
				/>
				<Typography
				  variant="span"
				  color="white"
				  fontSize={24}
				  fontWeight={700}
				  marginRight={1}
				>
				  #{("000" + (previousPokemon?.id || "000")).slice(-3)}
				</Typography>
				<Typography
				  display={{ xs: "none", sm: "block" }}
				  color="#616161"
				  fontSize={24}
				  fontWeight={700}
				>
				  {previousPokemon?.name
					? previousPokemon?.name[0].toUpperCase() +
					  previousPokemon?.name.slice(1)
					: "Unknown"}
				</Typography>
			  </Box>
			</Grid>
  
			{/* Next pokemon */}
			<Grid item xs={6}>
			  <Box
				pt={2}
				pb={8}
				pr={3}
				className="navigation-button"
				display="flex"
				alignItems="center"
				justifyContent="flex-end"
				sx={{ textDecoration: "none" }}
				component={Link}
				to={`/pokemons/${nextPokemon?.id || "1"}`}
			  >
				<Typography
				  display={{ xs: "none", sm: "block" }}
				  color="#616161"
				  fontSize={24}
				  fontWeight={700}
				  marginRight={1}
				>
				  {nextPokemon?.name
					? nextPokemon?.name[0].toUpperCase() +
					  nextPokemon?.name.slice(1)
					: "Unknown"}
				</Typography>
				<Typography color="white" fontSize={24} fontWeight={700}>
				  #{("000" + (nextPokemon?.id || "000")).slice(-3)}
				</Typography>
				<ArrowForwardIosIcon
				  sx={{
					color: "#616161",
					backgroundColor: "white",
					borderRadius: "50%",
					padding: "5px",
					ml: 2,
				  }}
				/>
			  </Box>
			</Grid>
		  </Grid>
  
		  {/* Current pokemon */}
		  <Box
			position="absolute"
			bottom={0}
			left="50%"
			sx={{ transform: "translateX(-50%)" }}
			textAlign="center"
			minWidth={"50%"}
			className="detail-name"
		  >
			<Box bgcolor="white" pt={2}>
			  <Typography sx={{ mr: 2 }} variant="h4" display="inline">
				{currentPokemon?.name
				  ? currentPokemon?.name[0].toUpperCase() +
					currentPokemon?.name.slice(1)
				  : "Unknown"}
			  </Typography>
			  <Typography variant="h4" display="inline" color="gray">
				#{("000" + (currentPokemon?.id || "000")).slice(-3)}
			  </Typography>
			</Box>
		  </Box>
		</Box>
		<Box
		  maxWidth="md"
		  sx={{
			margin: "auto!important",
			paddingX: "2rem",
			paddingY: "1rem",
			backgroundColor: "white",
			pt: 6,
		  }}
		>
		  <Grid container spacing={2}>
			<Grid item xs={12} md={6}>
			  <Box sx={{ backgroundColor: "#F2F2F2", borderRadius: 5 }}>
				<CardMedia
				  component="img"
				  image={
					`${currentPokemon?.url}`.includes("http" || "https")
					  ? `${currentPokemon?.url}`
					  : `${BASE_URL}${currentPokemon?.url}`
				  }
				  alt={`${currentPokemon?.name}`}
				  sx={{
					margin: "auto",
					height: "260px",
					width: "auto",
					borderRadius: 5,
				  }}
				/>
			  </Box>
			  <Button
				fullWidth
				disableRipple
				onClick={handleOpenPostEdit}
				sx={{
				  padding: "6px",
				  marginTop: "10px",
				  backgroundColor: "#a4a4a4",
				  textTransform: "capitalize",
				  color: "#fff",
				  fontSize: "1.1rem",
				  borderRadius: "20px",
				  "&:hover": {
					backgroundColor: "#a4a4a4",
				  },
				}}
			  >
				Update Pokemon Info
			  </Button>
			  <PokemonEdit
				pokemon={currentPokemon}
				openPostEdit={openPostEdit}
				handleClosePostEdit={handleClosePostEdit}
			  />
			  <Button
				fullWidth
				disableRipple
				onClick={handleOpenPokemonDelete}
				sx={{
				  padding: "6px",
				  marginTop: "6px",
				  backgroundColor: "#e3350d",
				  textTransform: "capitalize",
				  color: "#fff",
				  fontSize: "1.1rem",
				  borderRadius: "20px",
				  "&:hover": {
					backgroundColor: "#e3350d",
				  },
				}}
			  >
				Delete Pokemon
			  </Button>
			  <PokemonDelete
				pokemon={currentPokemon}
				openPokemonDelete={openPokemonDelete}
				handleClosePokemonDelete={handleClosePokemonDelete}
			  />
			</Grid>
			<Grid item xs={12} md={6}>
			  <Stack spacing={2}>
				<Typography variant="p" sx={{ fontWeight: 550 }}>
				  Bio
				</Typography>
				<Typography variant="p">
				  {currentPokemon?.description ||
					"There is no info for this Pokemon. Consider expanding the Pokedex by adding more content."}
				</Typography>
  
				<Typography variant="p" sx={{ fontWeight: 550 }}>
				  Stats
				</Typography>
				<Box
				  sx={{
					backgroundColor: "#30a7d7",
					borderRadius: "10px",
					padding: 3,
				  }}
				>
				  <Grid container rowSpacing={1}>
					<Grid item xs={6}>
					  <Typography color="white">Height</Typography>
					  <div>{currentPokemon?.height || "Unknown"}</div>
					</Grid>
					<Grid item xs={6}>
					  <Typography color="white">Weight</Typography>
					  <div>{currentPokemon?.weight || "Unknown"}</div>
					</Grid>
					<Grid item xs={6}>
					  <Typography color="white">Category</Typography>
					  <div>{currentPokemon?.category || "Unknown"}</div>
					</Grid>
					<Grid item xs={6}>
					  <Typography color="white">Abilities</Typography>
					  <div>{formattedAbilities()}</div>
					</Grid>
				  </Grid>
				</Box>
  
				<Typography variant="p" sx={{ fontWeight: 550 }}>
				  Types
				</Typography>
				<Grid container spacing={1}>
				  {currentPokemon?.types.map((type) => (
					<Grid item key={type} xs={4}>
					  <PokeType type={type} size="large" color="white" />
					</Grid>
				  ))}
				</Grid>
				<Typography variant="p" sx={{ fontWeight: 550 }}>
				  Weaknesses
				</Typography>
				<Grid container spacing={1}>
				  {weaknesses.map((type) => (
					<Grid item key={type} xs={4}>
					  <PokeType type={type} size="large" color="white" />
					</Grid>
				  ))}
				</Grid>
			  </Stack>
			</Grid>
		  </Grid>
		</Box>
	  </Container>
	);
  };
  
  const weaknesses = {
	normal: {
	  nullified: ["ghost"],
	  resistant: [],
	  weak: ["fighting"],
	},
	fire: {
	  nullified: [],
	  resistant: ["fire", "grass", "ice", "bug", "steel", "fairy"],
	  weak: ["water", "ground", "rock"],
	},
	water: {
	  nullified: [],
	  resistant: ["fire", "water", "ice", "steel"],
	  weak: ["electric", "grass"],
	},
	electric: {
	  nullified: [],
	  resistant: ["electric", "flying", "steel"],
	  weak: ["ground"],
	},
	grass: {
	  nullified: [],
	  resistant: ["water", "electric", "grass", "ground"],
	  weak: ["fire", "ice", "poison", "flying", "bug"],
	},
	ice: {
	  nullified: [],
	  resistant: ["ice"],
	  weak: ["fire", "fighting", "rock", "steel"],
	},
	fighting: {
	  nullified: [],
	  resistant: ["bug", "rock", "dark"],
	  weak: ["flying", "psychic", "fairy"],
	},
	poison: {
	  nullified: [],
	  resistant: ["grass", "fighting", "poison", "bug", "fairy"],
	  weak: ["ground", "psychic"],
	},
	ground: {
	  nullified: ["electric"],
	  resistant: ["poison", "rock"],
	  weak: ["water", "grass", "ice"],
	},
	flying: {
	  nullified: ["ground"],
	  resistant: ["grass", "fighting", "bug"],
	  weak: ["electric", "ice", "rock"],
	},
	psychic: {
	  nullified: [],
	  resistant: ["fighting", "psychic"],
	  weak: ["bug", "ghost", "dark"],
	},
	bug: {
	  nullified: [],
	  resistant: ["grass", "fighting", "ground"],
	  weak: ["fire", "flying", "rock"],
	},
	rock: {
	  nullified: [],
	  resistant: ["normal", "fire", "poison", "flying"],
	  weak: ["water", "grass", "fighting", "ground", "steel"],
	},
	ghost: {
	  nullified: ["normal", "fighting"],
	  resistant: ["poison", "bug"],
	  weak: ["ghost", "dark"],
	},
	dragon: {
	  nullified: [],
	  resistant: ["fire", "water", "electric", "grass"],
	  weak: ["ice", "dragon", "fairy"],
	},
	dark: {
	  nullified: ["psychic"],
	  resistant: ["ghost", "dark"],
	  weak: ["fighting", "bug", "fairy"],
	},
	steel: {
	  nullified: ["poison"],
	  resistant: [
		"normal",
		"grass",
		"ice",
		"flying",
		"psychic",
		"bug",
		"rock",
		"dragon",
		"steel",
		"fairy",
	  ],
	  weak: ["fire", "fighting", "ground"],
	},
	fairy: {
	  nullified: ["dragon"],
	  resistant: ["fighting", "bug", "dark"],
	  weak: ["poison", "steel"],
	},
  };
  
  const calculateWeaknesses = (types) => {
	if (!types) return [];
	let total = {
	  normal: 0,
	  fire: 0,
	  water: 0,
	  electric: 0,
	  grass: 0,
	  ice: 0,
	  fighting: 0,
	  poison: 0,
	  ground: 0,
	  flying: 0,
	  psychic: 0,
	  bug: 0,
	  rock: 0,
	  ghost: 0,
	  dragon: 0,
	  dark: 0,
	  steel: 0,
	  fairy: 0,
	};
  
	types.forEach((type) => {
	  weaknesses[type].weak.forEach((t) => total[t]++);
	  weaknesses[type].resistant.forEach((t) => total[t]--);
	  weaknesses[type].nullified.forEach((t) => total[t]--);
	});
	let final = [];
	Object.keys(total).forEach((type) => {
	  if (total[type] > 0) final.push(type);
	});
	return final;
  };
  