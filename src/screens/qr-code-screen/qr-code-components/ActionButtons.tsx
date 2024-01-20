import { Dispatch, SetStateAction } from "react";
import { View } from "react-native";
import { Button } from "react-native-paper";
import { handleVisitSite } from "../../../helpers/helperFunctions";
import { CopyTextComponent } from "./CopyTextComponent";

import validator from "validator";
const options = {
  require_protocol: false,
  require_valid_protocol: false,
  allow_underscores: true,
  allow_trailing_dot: false,
  allow_protocol_relative_urls: false,
};

interface ActionButtonsProps {
  code: string;
  setScanned: Dispatch<SetStateAction<boolean>>;
  setCode: Dispatch<SetStateAction<string>>;
  setLink: Dispatch<SetStateAction<string>>;
  setKey: Dispatch<SetStateAction<"reload" | "reload-again">>;
  link: string;
  scanned: boolean;
}
export const ActionButtons = ({
  code,
  setScanned,
  setCode,
  setLink,
  link,
  scanned,
  setKey,
}: ActionButtonsProps) => (
  <View
    style={{
      width: "100%",
      position: "absolute",
      paddingHorizontal: 14,
      bottom: 0,
      gap: 14,
    }}
  >
    {code && <CopyTextComponent text={code} numberOfLines={4} />}
    {link && <CopyTextComponent text={link} numberOfLines={4} validateLink />}
    <View
      style={{
        flexDirection: validator.isURL(link, options) ? "row" : "column",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        paddingBottom: 14,
      }}
    >
      {scanned && (
        <Button
          mode="contained"
          onPress={() => {
            setScanned(false);
            setCode("");
            setLink("");
            setKey((prev) => (prev === "reload" ? "reload-again" : "reload"));
          }}
        >
          Repetir
        </Button>
      )}
      {validator.isURL(link, options) && (
        <Button
          mode="contained"
          style={{
            backgroundColor: "#34d399",

            marginLeft: scanned ? 10 : 0,
          }}
          onPress={() => handleVisitSite(link)}
        >
          Link
        </Button>
      )}
    </View>
  </View>
);
