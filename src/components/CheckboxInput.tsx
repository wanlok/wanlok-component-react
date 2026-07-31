import { FormControl, FormLabel, Stack, Typography } from "@mui/material";
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
          gap: "1px",
          borderColor: "divider",
          borderWidth: 1,
          borderStyle: "solid",
          backgroundColor: "background.default"
        }}
      >
        {items.map((item, i) => (
          <Stack key={`item-${i}`} sx={{ flexDirection: "row", alignItems: "stretch", gap: "1px" }}>
            <Stack sx={{ p: 1, backgroundColor: "common.white" }}>
              <WCheckbox checked={values.includes(i)} onChange={() => onItemCheckedChange(i)} />
            </Stack>
            <Stack sx={{ flex: 1, justifyContent: "center", p: 1, backgroundColor: "common.white" }}>
              <Typography variant="body2">{item}</Typography>
            </Stack>
          </Stack>
        ))}
      </Stack>
    </FormControl>
  );
};
