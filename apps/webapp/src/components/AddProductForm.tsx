import {
  Button,
  Box,
  FormControl,
  Stack,
  TextField,
  Typography,
  InputLabel,
  Avatar,
} from "@mui/material";
import { AxiosError } from "axios";
import { Product } from "database";
import * as React from "react";

import { BuyResult } from "@types";
import { apiClient } from "@api";
import { NumberFormatCustom, ShowErrors } from "@components";

type Props = {
  onAdd: () => {};
};

export const AddProductForm = ({ onAdd }: Props) => {
  const [newProduct, setNewProduct] = React.useState<Partial<Product>>();

  const [error, setError] = React.useState<AxiosError>();

  return (
    <Box sx={{ width: "300px" }}>
      <Typography mb={5} textAlign="center" variant="h4">
        add product
      </Typography>

      <Stack gap={4}>
        <TextField
          label="cost"
          value={newProduct?.cost ? newProduct?.cost / 100 : undefined}
          onChange={(e) => {
            setNewProduct((current) => ({
              ...current,
              cost: parseFloat(e.target.value) * 100,
            }));
          }}
          InputProps={{
            inputComponent: NumberFormatCustom as any,
          }}
          variant="outlined"
        />
        <FormControl>
          <TextField
            label="amount available"
            value={newProduct?.amountAvailable ?? ""}
            onChange={(event) => {
              setNewProduct((current) => ({
                ...current,
                amountAvailable: parseInt(event.target.value),
              }));
            }}
            type="number"
            InputProps={{ inputProps: { min: 1 } }}
          />
        </FormControl>

        <FormControl>
          <TextField
            label="product name"
            onChange={(event) => {
              setNewProduct((current) => ({
                ...current,
                productName: event.target.value,
              }));
            }}
            type="text"
          />
        </FormControl>

        <FormControl>
          <TextField
            onChange={async (event) => {
              const file = (event.target as HTMLInputElement).files![0];
              const productImage = URL.createObjectURL(file);
              setNewProduct((current) => ({
                ...current,
                productImage,
              }));
            }}
            label="product image"
            type="file"
            inputProps={{ accept: "image/*" }}
            InputLabelProps={{ shrink: true }}
          />
        </FormControl>
        {newProduct?.productImage && <img src={newProduct.productImage} />}

        <Button
          onClick={async () => {
            try {
              await apiClient.post<BuyResult>("/products", newProduct);
              onAdd();
            } catch (e) {
              setError(e as AxiosError);
            }
          }}
          variant="outlined"
        >
          submit
        </Button>
      </Stack>
      <ShowErrors error={error as AxiosError} />
    </Box>
  );
};
