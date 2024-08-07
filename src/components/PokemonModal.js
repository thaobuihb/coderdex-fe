import Box from "@mui/material/Box";
import { FormProvider, FTextField } from "./form";
import Modal from "@mui/material/Modal";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Alert, alpha, Stack } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { addPokemon, getPokemons } from "../features/pokemons/pokemonSlice";
// import { useNavigate } from "react-router-dom";
import { pokemonTypes } from "../pokemonTypes";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const defaultValues = {
  name: "",
  id: "",
  url: "",
  type1: "",
  type2: "",
};

export default function PokemonModal({ open, setOpen }) {
  // const navigate = useNavigate();
  const methods = useForm(defaultValues);
  const {
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = methods;
  const dispatch = useDispatch();
  const { pokemonNames } = useSelector((state) => state.pokemons);

  const onSubmit = (data) => {
    let { name, url, type1, type2 } = data;

    try {
      if (!name || !url || !type1) {
        throw new Error(
          "Missing form information. Remember that each pokemon has either 1 or 2 types."
        );
      }
      name = name.toLowerCase();
      type1 = type1.toLowerCase();

      const duplicatePokemon = pokemonNames.filter(
        (pokemonName) => pokemonName === name
      );

      if (duplicatePokemon.length > 0) {
        throw new Error("Pokemon already exists.");
      }

      const isPokemonType1Valid = pokemonTypes.includes(type1);
      if (isPokemonType1Valid === false) {
        throw new Error("Pokemon's type 1 is invalid.");
      }

      if (type2) {
        type2 = type2.toLowerCase();
        const isPokemonType2Valid = pokemonTypes.includes(type2);

        if (isPokemonType2Valid === false) {
          throw new Error("Pokemon's type 2 is invalid.");
        }
      }

      dispatch(
        addPokemon({
          name,
          imgUrl: url,
          types: type2 ? [type1, type2] : [type1],
        })
      );
      // navigate(`/pokemons/${id}`);
      setOpen(false);
      reset();
    } catch (error) {
      setError("responseError", { message: error.message });
    }
  };

  const handleClose = () => {
    dispatch(getPokemons());
    setOpen(false);
    reset();
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2}>
              {!!errors.responseError && (
                <Alert severity="error">{errors.responseError.message}</Alert>
              )}
              <FTextField
                name="name"
                fullWidth
                rows={4}
                placeholder="Name"
                sx={{
                  "& fieldset": {
                    borderWidth: `1px !important`,
                    borderColor: alpha("#919EAB", 0.32),
                  },
                }}
              />
              {/* <FTextField
                name="id"
                fullWidth
                rows={4}
                placeholder="Id"
                sx={{
                  "& fieldset": {
                    borderWidth: `1px !important`,
                    borderColor: alpha("#919EAB", 0.32),
                  },
                }}
              /> */}
              <FTextField
                name="url"
                fullWidth
                placeholder="Image Url"
                sx={{
                  "& fieldset": {
                    borderWidth: `1px !important`,
                    borderColor: alpha("#919EAB", 0.32),
                  },
                }}
              />
              <FTextField
                name="type1"
                fullWidth
                rows={4}
                placeholder="Type 1"
                sx={{
                  "& fieldset": {
                    borderWidth: `1px !important`,
                    borderColor: alpha("#919EAB", 0.32),
                  },
                }}
              />
              <FTextField
                name="type2"
                fullWidth
                rows={4}
                placeholder="Type 2"
                sx={{
                  "& fieldset": {
                    borderWidth: `1px !important`,
                    borderColor: alpha("#919EAB", 0.32),
                  },
                }}
              />

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                }}
              >
                <LoadingButton
                  type="submit"
                  variant="contained"
                  size="small"
                  loading={isSubmitting}
                >
                  Create Pokemon
                </LoadingButton>
              </Box>
            </Stack>
          </FormProvider>
        </Box>
      </Modal>
    </div>
  );
}
