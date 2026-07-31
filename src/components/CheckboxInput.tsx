import { ButtonBase, Divider, FormControl, FormLabel, Stack, Typography } from "@mui/material";
import { WCheckbox } from "./WCheckbox";

export const CheckboxInput = ({
  label,
  items,
  values,
  onChange
}: {
  label?: string;
  items: string[];
  values: number[];
  onChange: (values: number[]) => void;
}) => {
  const onItemCheckedChange = (index: number) => {
    onChange(values.includes(index) ? values.filter((i) => i !== index) : [...values, index]);
  };
  return (
    <FormControl>
      {label && (
        <FormLabel focused={false} sx={{ color: "text.primary", typography: "body2", mb: "4px" }}>
          {label}
        </FormLabel>
      )}
      <Stack
        sx={{
          backgroundColor: "common.white",
          borderColor: "divider",
          borderWidth: 1,
          borderStyle: "solid",
          "&:hover": { borderColor: "common.black" }
        }}
      >
        {items.map((item, i) => (
          <>
            {i !== 0 && <Divider sx={{ borderColor: "background.default" }} />}
            <ButtonBase
              key={`item-${i}`}
              sx={{ flexDirection: "row", alignItems: "stretch", width: "100%" }}
              onClick={() => onItemCheckedChange(i)}
            >
              <Stack sx={{ p: 1, backgroundColor: "common.white" }} onClick={(e) => e.stopPropagation()}>
                <WCheckbox checked={values.includes(i)} onChange={() => onItemCheckedChange(i)} />
              </Stack>
              <Stack
                sx={{
                  flex: 1,
                  justifyContent: "center",
                  textAlign: "left",
                  py: 1,
                  pr: 1,
                  backgroundColor: "common.white"
                }}
              >
                <Typography variant="body1">{item}</Typography>
              </Stack>
            </ButtonBase>
          </>
        ))}
      </Stack>
    </FormControl>
  );
};
