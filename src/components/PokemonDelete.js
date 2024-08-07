import { Box, Button, Card, Container, Modal, Typography } from "@mui/material";
import { deletePokemon } from "../features/pokemons/pokemonSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const customStyledDeleteCard = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "500px",
  maxWidth: "540px",
  backgroundColor: "white",
};

function PokemonDelete({
  pokemon,
  openPokemonDelete,
  handleClosePokemonDelete,
}) {
  const dispatch = useDispatch();
  const nextPokemonId = useSelector(
    (state) => state.pokemons?.pokemon?.nextPokemon?.id
  );

  const navigate = useNavigate();

  const handleDeletePokemon = () => {
    dispatch(deletePokemon(pokemon.id));
    navigate(`/pokemons/${nextPokemonId}`);
    handleClosePokemonDelete();
  };

  return (
    <Modal open={openPokemonDelete} onClose={handleClosePokemonDelete}>
      <Card sx={customStyledDeleteCard}>
        <Container spacing={2} sx={{ px: 4, py: 5 }}>
          <Typography sx={{ textAlign: "center", fontSize: "1.2rem" }}>
            Are you sure you want to delete this Pokemon?
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              marginTop: "24px",
            }}
          >
            <Button
              sx={{
                padding: "6px 20px",
                width: "100px",
                backgroundColor: "#a4a4a4",
                textTransform: "capitalize",
                color: "#fff",
                fontSize: "1.2rem",
                borderRadius: "14px",
                "&:hover": {
                  backgroundColor: "#a4a4a4",
                },
              }}
              onClick={handleClosePokemonDelete}
            >
              Nope
            </Button>
            <Button
              sx={{
                padding: "6px 20px",
                width: "100px",
                backgroundColor: "#e3350d",
                textTransform: "capitalize",
                color: "#fff",
                fontSize: "1.2rem",
                borderRadius: "14px",
                "&:hover": {
                  backgroundColor: "#e3350d",
                },
              }}
              onClick={handleDeletePokemon}
            >
              Yes
            </Button>
          </Box>
        </Container>
      </Card>
    </Modal>
  );
}

export default PokemonDelete;
