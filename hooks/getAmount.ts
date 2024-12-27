import axios from "axios";
import { useEffect, useState } from "react";

function useGetAmount({
  baseAmount,
  baseBundleAmount,
  token,
  originalAmount,
}: {
  baseAmount: string;
  baseBundleAmount: string;
  token?: string | string[];
  originalAmount: string;
}) {
  const [isLoading, setLoading] = useState(false);
  const [BaseAmount, setBaseAmount] = useState(baseAmount);
  const [mainButtonAmount, setMainButtonAmount] = useState(baseAmount);
  const [bundleButtonAmount, setBundleButtonAmount] =
    useState(baseBundleAmount);
  const [isToken, setIsToken] = useState(false);
  const [isDiscounted, setDiscounted] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    if (token) {
      setLoading(true);
      axios
        .post(`${process.env.NEXT_PUBLIC_BASE_API}payments/check-token`, {
          token: token,
        })
        .then((response: any) => {
          if (response && response.data && response.data.data) {
            if (
              response.data.data?.discountedPriceToken ||
              response.data.data?.discountedPriceDirect
            ) {
              setDiscounted(true);
              setBaseAmount(
                response.data.data?.discountedPriceToken ||
                  response.data.data?.discountedPriceDirect
              );
            }

            if (
              response.data &&
              response.data.data &&
              response.data.data?.amount
            ) {
              setIsToken(true);
              setMainButtonAmount(response.data.data.amount);
            } else {
              setMainButtonAmount(
                response.data.data?.discountedPriceToken ||
                  response.data.data?.discountedPriceDirect
              );
            }
          }
        })
        .catch((error) => {
          setError(error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [token, baseAmount]);
  return {
    mainButtonAmount,
    bundleButtonAmount,
    originalAmount,
    isDiscounted,
    isToken,
    BaseAmount,
    baseBundleAmount,
    error,
    isLoading,
  };
}

export default useGetAmount;
