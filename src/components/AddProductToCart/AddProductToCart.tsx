import Typography from "@mui/material/Typography";
import { Product } from "~/models/Product";
import CartIcon from "@mui/icons-material/ShoppingCart";
import Add from "@mui/icons-material/Add";
import Remove from "@mui/icons-material/Remove";
import IconButton from "@mui/material/IconButton";
import { useCart, useInvalidateCart, useUpsertCart } from "~/queries/cart";
import { cart } from "~/mocks/data";

type AddProductToCartProps = {
  product: Product;
};

export default function AddProductToCart({ product }: AddProductToCartProps) {
  const { data, isFetching } = useCart();
  const { mutate: upsertCart } = useUpsertCart();
  const invalidateCart = useInvalidateCart();
  const items = data ? data.items : [];
  const cartItemIndex = items.findIndex((i) => i.product.id === product.id);
  const cartItem = items[cartItemIndex];

  const addProduct = () => {
    let updatedCart;

    if (!cartItem) {
      const newItem = { product, count: 1 };
      updatedCart = {
        id: data?.id ?? null,
        items: [newItem],
      };
    } else {
      updatedCart = {
        id: data?.id ?? null,
        items: [
          ...items.slice(0, cartItemIndex),
          { ...cartItem, count: cartItem.count + 1 },
          ...items.slice(cartItemIndex + 1),
        ],
      };
    }

    upsertCart(updatedCart, { onSuccess: invalidateCart });
  };

  const removeProduct = () => {
    if (!cartItem) {
      return;
    }

    if (cartItem.count === 1) {
      const updatedCart = {
        id: data?.id ?? null,
        items: [
          ...items.slice(0, cartItemIndex),
          ...items.slice(cartItemIndex + 1),
        ],
      };

      upsertCart(updatedCart, { onSuccess: invalidateCart });
      return;
    }

    if (cartItem) {
      const updatedCart = {
        id: data?.id ?? null,
        items: [
          ...items.slice(0, cartItemIndex),
          { ...cartItem, count: cartItem.count - 1 },
          ...items.slice(cartItemIndex + 1),
        ],
      };

      upsertCart(updatedCart, { onSuccess: invalidateCart });
    }
  };

  return cartItem ? (
    <>
      <IconButton disabled={isFetching} onClick={removeProduct} size="large">
        <Remove color={"secondary"} />
      </IconButton>
      <Typography align="center">{cartItem.count}</Typography>
      <IconButton disabled={isFetching} onClick={addProduct} size="large">
        <Add color={"secondary"} />
      </IconButton>
    </>
  ) : (
    <IconButton disabled={isFetching} onClick={addProduct} size="large">
      <CartIcon color={"secondary"} />
    </IconButton>
  );
}
