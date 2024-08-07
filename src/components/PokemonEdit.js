import {
    Alert,
    Box,
    Card,
    CardHeader,
    Container,
    IconButton,
    Modal,
    Typography,
    alpha,
  } from "@mui/material";
  import { useForm } from "react-hook-form";
  import CloseIcon from "@mui/icons-material/Close";
  import { LoadingButton } from "@mui/lab";
  import { useDispatch, useSelector } from "react-redux";
  import { FTextField, FormProvider } from "./form";
  import { editPokemon } from "../features/pokemons/pokemonSlice";
  import { pokemonTypes } from "../pokemonTypes";
  
  const customStyledCard = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "500px",
    maxWidth: "540px",
    backgroundColor: "white",
  };
  
  function PokemonEdit({ pokemon, openPostEdit, handleClosePostEdit }) {
    const methods = useForm({
      values: {
        name: pokemon?.name,
        url: pokemon?.url,
        type1: pokemon?.types[0],
        type2: pokemon?.types[1],
        isSubmitting: false,
      },
    });
  
    const {
      handleSubmit,
      setValue,
      setError,
      clearErrors,
      watch,
      formState: { errors },
    } = methods;
  
    const isSubmitting = watch("isSubmitting");
    const dispatch = useDispatch();
  
    const handleCloseEditForm = () => {
      handleClosePostEdit();
      clearErrors();
    };
  
    const { filteredData } = useSelector((state) => state.pokemons);
  
    const onSubmit = (data) => {
      try {
        setValue("isSubmitting", true);
        let { name, url, type1, type2 } = data;
        data = {
          name,
          url,
          types: type2 ? [type1, type2] : [type1],
          id: pokemon?.id,
        };
  
        const duplicatePokemonIndex = filteredData.findIndex(
          (item) => item.name === name.toLowerCase()
        );
  
        if (duplicatePokemonIndex >= 0) {
          setValue("isSubmitting", false);
          throw new Error("Pokemon already exists.");
        }
  
        const isPokemonType1Valid = pokemonTypes.includes(type1);
        if (isPokemonType1Valid === false) {
          setValue("isSubmitting", false);
          throw new Error("Pokemon's type 1 is invalid.");
        }
  
        if (type2) {
          type2 = type2.toLowerCase();
          const isPokemonType2Valid = pokemonTypes.includes(type2);
  
          if (isPokemonType2Valid === false) {
            setValue("isSubmitting", false);
            throw new Error("Pokemon's type 2 is invalid.");
          }
        }
  
        setValue("isSubmitting", false);
  
        dispatch(editPokemon(data));
        handleClosePostEdit();
      } catch (error) {
        setError("responseError", { message: error.message });
      }
    };
  
    return (
      <Modal open={openPostEdit} onClose={handleCloseEditForm}>
        <Card sx={customStyledCard}>
          <CardHeader
            action={
              <IconButton onClick={handleCloseEditForm}>
                <CloseIcon sx={{ fontSize: 28 }} />
              </IconButton>
            }
            sx={{ pb: 0, height: "48px" }}
          />
          <Container spacing={2} sx={{ p: 3 }}>
            {!!errors.responseError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {errors.responseError.message}
              </Alert>
            )}
            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
              <Typography variant="p" sx={{ fontWeight: 550 }}>
                Pokemon Name
              </Typography>
              <FTextField
                name="name"
                fullWidth
                sx={{
                  marginBottom: "10px",
                  "& fieldset": {
                    height: "100%",
                    borderWidth: "1px !important",
                    borderColor: alpha("#919EAB", 0.32),
                  },
                }}
              />
  
              <Typography variant="p" sx={{ fontWeight: 550 }}>
                Image URL
              </Typography>
              <FTextField
                name="url"
                fullWidth
                sx={{
                  marginBottom: "10px",
                  "& fieldset": {
                    height: "100%",
                    borderWidth: "1px !important",
                    borderColor: alpha("#919EAB", 0.32),
                  },
                }}
              />
  
              <Typography variant="p" sx={{ fontWeight: 550 }}>
                Pokemon Type 1
              </Typography>
              <FTextField
                name="type1"
                fullWidth
                sx={{
                  marginBottom: "10px",
                  "& fieldset": {
                    height: "100%",
                    borderWidth: "1px !important",
                    borderColor: alpha("#919EAB", 0.32),
                  },
                }}
              />
  
              <Typography variant="p" sx={{ fontWeight: 550 }}>
                Pokemon Type 2
              </Typography>
              <FTextField
                name="type2"
                fullWidth
                sx={{
                  marginBottom: "10px",
                  "& fieldset": {
                    height: "100%",
                    borderWidth: "1px !important",
                    borderColor: alpha("#919EAB", 0.32),
                  },
                }}
              />
  
              <Box sx={{ marginTop: "14px" }}>
                <LoadingButton
                  type="submit"
                  variant="contained"
                  size="small"
                  loading={isSubmitting}
                  sx={{
                    width: "100%",
                    padding: "6px",
                    textTransform: "capitalize",
                    fontWeight: 500,
                    fontSize: 16,
                  }}
                >
                  Save
                </LoadingButton>
              </Box>
            </FormProvider>
          </Container>
        </Card>
      </Modal>
    );
  }
  
  export default PokemonEdit;
  