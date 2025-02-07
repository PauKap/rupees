import { CurrencyRupee } from "@mui/icons-material";
import {
  Avatar,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { AxiosError } from "axios";
import { Product } from "database";
import { useContext, useEffect, useState } from "react";

import { ROLE } from "@constants";
import { BuyResult } from "@types";
import { apiClient } from "@api";
import { ShowErrors, UserContext } from "@components";
import dayjs from "dayjs";

type Props = {
  products: Product[];
  setProducts: (_data: Product[]) => void;
  onBuy: (_buyResylt: BuyResult) => void;
  setSelectedProduct: (_data: Product) => void;
};

export const ProductList = ({
  products,
  setProducts,
  onBuy,
  setSelectedProduct,
}: Props) => {
  const [error, setError] = useState<AxiosError>();
  useEffect(() => {
    (async () => {
      try {
        setProducts((await apiClient.get("/products")).data);
        setError(undefined);
      } catch (e) {
        setError(e as AxiosError);
      }
    })();
  }, [setProducts]);

  const [amount, setAmount] = useState<number>(1);

  const { user } = useContext(UserContext);

  if (!user) {
    return null;
  }

  if (products.length === 0) {
    return <Typography>There are currently no products.</Typography>;
  }

  return (
    <Stack alignItems="center" gap={3} display="flex" width="100%">
      <List
        sx={{
          pt: 2,
          pb: 0,
          width: "100%",
          maxWidth: "700px",
          maxHeight: error
            ? { xs: "65vh", md: "100vh" }
            : { xs: "calc(100vh - 56px)", md: "100vh" },
          overflow: "scroll",
          bgcolor: "background",
        }}
      >
        {products?.map((product) =>
          product.amountAvailable > 0 ? (
            <ListItem
              key={product.id}
              // disabled={dayjs(product?.expireDate)?.isBefore(dayjs())}
            >
              <ListItemAvatar>
                <Avatar
                  alt={`productImage-${product.id}`}
                  src={product?.productImage || ""}
                />
              </ListItemAvatar>
              <ListItemText
                sx={{ width: { md: "300px", xs: "80px" } }}
                primary={
                  <>
                    <Typography fontSize={20}>
                      {product.productName}
                      <Typography ml={1} fontSize={15} component="span">
                        ({product.amountAvailable})
                      </Typography>

                      <Typography component="span">
                        {" "}
                        -{" "}
                        {dayjs(product.expireDate).isBefore(dayjs())
                          ? "Expired"
                          : "Expire"}{" "}
                        at {dayjs(product.expireDate).format("L LT")}
                      </Typography>
                    </Typography>
                    <Typography
                      fontSize={25}
                      fontWeight="700"
                      color="secondary"
                      display="flex"
                    >
                      <CurrencyRupee fontSize="large" />
                      {`${product.cost / 100}`}
                    </Typography>
                  </>
                }
                secondary={<span></span>}
              />

              {user?.role === ROLE.SELLER && product.sellerId === user?.id && (
                <>
                  <Button
                    onClick={() => {
                      setSelectedProduct(product);
                    }}
                    variant="contained"
                    color="secondary"
                    size="small"
                  >
                    edit
                  </Button>
                </>
              )}

              {user?.role === ROLE.BUYER && (
                <>
                  <TextField
                    sx={{ mr: 2, width: { xs: 60, md: 90 } }}
                    defaultValue={amount}
                    label="amount"
                    onChange={(event) => {
                      setAmount(parseInt(event.target.value));
                    }}
                    type="number"
                    InputProps={{
                      inputProps: {
                        min: product.amountAvailable > 0 ? 1 : 0,
                        max: product.amountAvailable,
                      },
                    }}
                    disabled={dayjs(product?.expireDate)?.isBefore(dayjs())}
                  />
                  <Button
                    onClick={async () => {
                      try {
                        const { data: bought } = await apiClient.post("/buy", {
                          productId: product.id,
                          amount: amount,
                        });
                        onBuy(bought);
                      } catch (e) {
                        setError(e as AxiosError);
                      }
                    }}
                    variant="contained"
                    color="secondary"
                    size="large"
                    disabled={dayjs(product?.expireDate)?.isBefore(dayjs())}
                  >
                    buy
                  </Button>
                </>
              )}
            </ListItem>
          ) : null
        )}
      </List>
      <ShowErrors error={error as AxiosError} />
    </Stack>
  );
};
