import React, { ReactNode, createContext, useContext, useState } from "react";

interface LitLensState {
  ocrResult: string;
  setOcrResult: React.Dispatch<React.SetStateAction<string>>;
  imageSource: string | null;
  setImageSource: React.Dispatch<React.SetStateAction<string | null>>;
}

// Criação do contexto com um valor padrão
const LitLensContext = createContext<LitLensState | undefined>(undefined);

// Criação do Provider
interface LitLensProviderProps {
  children: ReactNode;
}

export const LitLensProvider = ({ children }: LitLensProviderProps) => {
  const [ocrResult, setOcrResult] = useState("");
  const [imageSource, setImageSource] = useState<string | null>("");

  return (
    <LitLensContext.Provider
      value={{ ocrResult, setOcrResult, imageSource, setImageSource }}
    >
      {children}
    </LitLensContext.Provider>
  );
};

// Hook personalizado para usar o contexto
export const useLitLens = () => {
  const context = useContext(LitLensContext);
  if (!context)
    throw new Error("useLitLens must be used within a LitLensProvider");
  const { ocrResult, setOcrResult, imageSource, setImageSource } = context;
  return { ocrResult, setOcrResult, imageSource, setImageSource };
};
