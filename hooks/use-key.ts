import axios from "axios";
import React, { useEffect } from "react";

export default function useKey<T>(
  key: string,
  { json = true }: { json: boolean }
) {
  const [value, setValue] = React.useState<T | null>(null);

  const fetchKey = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_API}key-value/${key}`
      );
      setValue(json ? JSON.parse(data.data.value) : data.data.value);
    } catch (error) {
      console.error("Error during key fetch:", error);
    }
  };

  useEffect(() => {
    fetchKey();
  }, [key]);

  return value;
}
