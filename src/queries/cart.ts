import axios, { AxiosError } from "axios";
import React from "react";
import { useQuery, useQueryClient, useMutation } from "react-query";
import API_PATHS from "~/constants/apiPaths";
import { CartItem } from "~/models/CartItem";

type Cart = {
  id: string | null;
  items: CartItem[];
};

type CartResponse = {
  data: {
    message: string;
    statusCode: number;
    cart: Cart;
  };
};

export function useCart() {
  return useQuery<Cart, AxiosError>("cart", async () => {
    const res = await axios.get<CartResponse>(
      `${API_PATHS.cart}/profile/cart`,
      {
        headers: {
          Authorization: `Basic ${localStorage.getItem("authorization_token")}`,
        },
      }
    );
    return res.data.data.cart;
  });
}

export function useCartData() {
  const queryClient = useQueryClient();
  return queryClient.getQueryData<CartItem[]>("cart");
}

export function useInvalidateCart() {
  const queryClient = useQueryClient();
  return React.useCallback(
    () => queryClient.invalidateQueries("cart", { exact: true }),
    []
  );
}

export function useUpsertCart() {
  return useMutation((cart: Cart) =>
    axios.put<Cart>(`${API_PATHS.cart}/profile/cart`, cart, {
      headers: {
        Authorization: `Basic ${localStorage.getItem("authorization_token")}`,
      },
    })
  );
}
