import { useState } from "react";
import { folders, usePrices } from "./usePrices";
import { LayoutPanel } from "../../components/LayoutPanel";
import { WCardList } from "../../components/WCardList";
import {
  MonetizationOn as MonetizationOnIcon,
  MonetizationOnOutlined as MonetizationOnOutlinedIcon
} from "@mui/icons-material";
import { PanelRow } from "../../components/PanelRow";
import { LeftHeader } from "./LeftHeader";
import { Index as GamePriceIndex } from "./games";
import { Index as SupermarketsIndex } from "./supermarkets";

const iconSize = 24;

export const Prices = () => {
  const { selectedFolder, openFolder } = usePrices();
  const [panelOpened, setPanelOpened] = useState<boolean>(false);
  return (
    <LayoutPanel
      panelOpened={panelOpened}
      setPanelOpened={setPanelOpened}
      width={300}
      panel={
        <>
          <LeftHeader />
          <WCardList
            items={folders}
            renderContent={(folder) => {
              const Icon = folder === selectedFolder ? MonetizationOnIcon : MonetizationOnOutlinedIcon;
              return <PanelRow icon={<Icon sx={{ fontSize: iconSize }} />} title={folder.name} />;
            }}
            onContentClick={(folder) => {
              if (folder) {
                openFolder(folder);
              }
              setPanelOpened(false);
            }}
            renderRightContent={() => <></>}
          />
        </>
      }
      topChildren={
        selectedFolder ? (
          <PanelRow icon={<MonetizationOnIcon sx={{ fontSize: 24 }} />} title={selectedFolder.name} />
        ) : (
          <></>
        )
      }
    >
      {selectedFolder?.id === "games" && <GamePriceIndex />}
      {selectedFolder?.id === "supermarkets" && <SupermarketsIndex />}
    </LayoutPanel>
  );
};
