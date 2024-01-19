import { Dispatch, SetStateAction } from "react";
import { View } from "react-native";
import { Button } from "react-native-paper";
import { handleVisitSite, isValidURL } from "../../../helpers/helperFunctions";
import { CopyTextComponent } from "./CopyTextComponent";

interface ActionButtonsProps {
  code: string;
  setScanned: Dispatch<SetStateAction<boolean>>;
  setCode: Dispatch<SetStateAction<string>>;
  setLink: Dispatch<SetStateAction<string>>;
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
    {link && <CopyTextComponent text={link} numberOfLines={4} />}
    <View
      style={{
        flexDirection: isValidURL(link) ? "row" : "column",
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
          }}
        >
          Repetir
        </Button>
      )}
      {isValidURL(link) && (
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
