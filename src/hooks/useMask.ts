// src/hooks/useMask.ts
import { useCallback } from "react";

export function useMask(mask?: string) {
  return useCallback(
    (value: string) => {
      if (!mask) return value;

      const numericValue = value.replace(/\D/g, "");
      let maskedValue = "";
      let numericIndex = 0;

      for (
        let i = 0;
        i < mask.length && numericIndex < numericValue.length;
        i++
      ) {
        if (mask[i] === "9") {
          maskedValue += numericValue[numericIndex];
          numericIndex++;
        } else {
          maskedValue += mask[i];
          if (numericValue[numericIndex] === mask[i]) {
            numericIndex++;
          }
        }
      }

      return maskedValue;
    },
    [mask]
  );
}
