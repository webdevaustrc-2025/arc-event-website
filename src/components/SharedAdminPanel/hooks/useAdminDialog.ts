"use client";

import { useState, useCallback } from "react";
import type { DialogState } from "../types/admin";

export function useAdminDialog() {
  const [state, setState] = useState<DialogState>({
    isOpen: false,
    mode: "create",
  });

  const open = useCallback((mode: "create" | "edit" = "create", data?: any) => {
    setState({
      isOpen: true,
      mode,
      data,
    });
  }, []);

  const close = useCallback(() => {
    setState({
      isOpen: false,
      mode: "create",
      data: undefined,
    });
  }, []);

  return {
    ...state,
    open,
    close,
  };
}
