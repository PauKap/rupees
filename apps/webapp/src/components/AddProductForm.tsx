import {
  Button,
  Box,
  FormControl,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { AxiosError } from "axios";
import { Product } from "database";
import * as React from "react";
import Grid from "@mui/material/Grid"; // Grid version 1

import { BuyResult } from "@types";
import { apiClient } from "@api";
import { NumberFormatCustom, ShowErrors } from "@components";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";

type Props = {
  onAdd: () => {};
  setSelectedProduct: (_data: Product | undefined) => void;
  selectedProduct: Product | undefined;
};

export const AddProductForm = ({
  onAdd,
  selectedProduct,
  setSelectedProduct,
}: Props) => {
  React.useEffect(() => {
    setNewProduct({
      ...selectedProduct,
    });
  }, [selectedProduct]);

  const [newProduct, setNewProduct] = React.useState<Partial<Product>>({
    expireDate: dayjs().add(7, "day").toISOString(),
  });
  const [productImageKey, setProductImageKey] = React.useState<React.Key>();

  const [error, setError] = React.useState<AxiosError>();

  const fileToBase64 = (file: File | Blob): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result as string);
      };

      reader.readAsDataURL(file);
      reader.onerror = reject;
    });

  return (
    <Box sx={{ width: "300px" }}>
      <Typography mb={5} textAlign="center" variant="h4">
        add product
      </Typography>
      <Stack gap={4}>
        <TextField
          label="cost"
          value={newProduct?.cost ? newProduct?.cost / 100 : ""}
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
            value={newProduct?.productName ?? ""}
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
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              shouldDisableDate={(date) => {
                if (date?.day() === 0 || date?.day() === 6) {
                  return true;
                }
                return false;
              }}
              label="expire date"
              value={
                newProduct?.expireDate ? dayjs(newProduct.expireDate) : dayjs()
              }
              onChange={(value) => {
                setNewProduct((current) => ({
                  ...current,
                  expireDate: value?.toISOString(),
                }));
              }}
            />
          </LocalizationProvider>
        </FormControl>
        <FormControl>
          <TextField
            key={productImageKey}
            onChange={async (event) => {
              const file = (event.target as HTMLInputElement).files![0];
              if (file?.size > 500000) {
                alert("product image is too big");
              } else if (file) {
                const productImage = await fileToBase64(file);
                setNewProduct((current) => ({
                  ...current,
                  productImage: productImage,
                }));
              }
            }}
            label="product image"
            type="file"
            inputProps={{ accept: "image/*" }}
            InputLabelProps={{ shrink: true }}
          />
        </FormControl>
        {newProduct?.productImage && <img src={newProduct.productImage} />}

        <Grid container>
          <Grid item xs={6}>
            <Button
              onClick={async () => {
                try {
                  setNewProduct({
                    expireDate: dayjs().add(7, "day").toISOString(),
                  });
                  setSelectedProduct(undefined);
                  setProductImageKey(Math.random());
                  setError(undefined);
                  onAdd();
                } catch (e) {
                  setError(e as AxiosError);
                }
              }}
              variant="outlined"
              fullWidth
            >
              cancel
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              onClick={async () => {
                try {
                  if (selectedProduct) {
                    await apiClient.put<BuyResult>(
                      `/products/${selectedProduct.id}`,
                      {
                        ...newProduct,
                        productImage:
                          newProduct?.productImage ||
                          selectedProduct.productImage,
                      } as Product
                    );
                  } else {
                    await apiClient.post<BuyResult>("/products", newProduct);
                  }

                  setNewProduct({
                    expireDate: dayjs().add(7, "day").toISOString(),
                  });
                  setSelectedProduct(undefined);
                  setProductImageKey(Math.random());
                  setError(undefined);
                  onAdd();
                } catch (e) {
                  setError(e as AxiosError);
                }
              }}
              variant="contained"
              fullWidth
            >
              {selectedProduct ? "edit" : "submit"}
            </Button>
          </Grid>
        </Grid>
      </Stack>
      <ShowErrors error={error as AxiosError} />
    </Box>
  );
};
