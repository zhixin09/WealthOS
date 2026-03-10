"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

type ClientContextType = {
  activeClientId: string;
  setActiveClientId: (id: string) => void;
};

const ClientContext = createContext<ClientContextType>({
  activeClientId: "alex_chen",
  setActiveClientId: () => {},
});

export function ClientProvider({ children }: { children: ReactNode }) {
  const [activeClientId, setActiveClientId] = useState("alex_chen");

  return (
    <ClientContext.Provider value={{ activeClientId, setActiveClientId }}>
      {children}
    </ClientContext.Provider>
  );
}

export function useActiveClient() {
  return useContext(ClientContext);
}
