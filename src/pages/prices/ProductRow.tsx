import { ButtonBase, Divider, Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { OneLineTypography } from "../../components/OneLineTypography";
import { layoutHeaderHeight } from "../../components/LayoutHeader";
import { iconButtonSx, WButton } from "../../components/WButton";

export type PriceItem = { price: number | undefined; line1: string; line2?: string; url: string | undefined };

const PriceButton = ({ price, line1, line2, url }: PriceItem) => {
  return (
    <ButtonBase
      disabled={!url}
      onClick={() => url && window.open(url, "_blank", "noopener,noreferrer")}
      sx={{
        flexDirection: "column",
        justifyContent: "center",
        p: 2,
        gap: 0.5,
        width: layoutHeaderHeight,
        aspectRatio: "1"
      }}
    >
      <Typography variant="body1" noWrap sx={{ color: price === undefined ? "text.disabled" : undefined }}>
        {price !== undefined ? `$${price.toFixed(2)}` : "N/A"}
      </Typography>
      <Typography variant="body2" sx={{ color: "text.secondary" }}>
        {line1}
      </Typography>
      {line2 && <Typography variant="body2">{line2}</Typography>}
    </ButtonBase>
  );
};

const TitleColumn = ({ title, subtitle, onClick }: { title: string; subtitle: string; onClick: () => void }) => {
  const { breakpoints } = useTheme();
  const mobile = useMediaQuery(breakpoints.down("md"));

  return (
    <ButtonBase
      onClick={onClick}
      sx={{
        display: "flex",
        p: 2,
        ...(mobile
          ? {
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
              backgroundColor: "primary.main"
            }
          : { flex: 1, flexDirection: "column", alignItems: "flex-start", gap: 0.5 })
      }}
    >
      <OneLineTypography variant="body1" sx={{ textAlign: "left" }}>
        {title}
      </OneLineTypography>
      <Typography variant="body2" sx={{ color: "text.secondary" }}>
        {subtitle}
      </Typography>
    </ButtonBase>
  );
};

export const ProductRow = ({
  title,
  subtitle,
  prices,
  deleteMode,
  onClick,
  onDeleteButtonClick
}: {
  title: string;
  subtitle: string;
  prices: PriceItem[];
  deleteMode: boolean;
  onClick: () => void;
  onDeleteButtonClick: () => void;
}) => {
  const { breakpoints } = useTheme();
  const mobile = useMediaQuery(breakpoints.down("md"));

  return (
    <>
      <Stack sx={{ flexDirection: mobile ? "column" : "row" }}>
        <TitleColumn title={title} subtitle={subtitle} onClick={onClick} />
        <Stack sx={{ flexDirection: "row", minWidth: 0 }}>
          <Stack sx={{ flexDirection: "row", overflowX: "auto", minWidth: 0 }}>
            {prices.map((priceItem, i) => (
              <Stack key={priceItem.line1} sx={{ flexDirection: "row", flexShrink: 0 }}>
                {i > 0 && <Divider orientation="vertical" flexItem sx={{ my: 2 }} />}
                <PriceButton {...priceItem} />
              </Stack>
            ))}
          </Stack>
          <Stack>
            {deleteMode && (
              <WButton
                onClick={onDeleteButtonClick}
                sx={{ ...iconButtonSx, backgroundColor: "transparent", "&:hover": { backgroundColor: "action.hover" } }}
              >
                <CloseIcon sx={{ fontSize: 24 }} />
              </WButton>
            )}
          </Stack>
        </Stack>
      </Stack>
      {!mobile && <Divider sx={{ ml: 2 }} />}
    </>
  );
};
