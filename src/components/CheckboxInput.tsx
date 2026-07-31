import { ButtonBase, Divider, FormControl, FormLabel, Stack, Typography } from "@mui/material";
import { Done as DoneIcon } from "@mui/icons-material";

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
              component="div"
              sx={{ flexDirection: "row", alignItems: "stretch", width: "100%" }}
              onClick={() => onItemCheckedChange(i)}
            >
              <Stack
                sx={{
                  width: 20,
                  py: 1,
                  pl: 1
                }}
              >
                {values.includes(i) && <DoneIcon sx={{ fontSize: 20, mt: "1px" }} />}
              </Stack>
              <Stack
                sx={{
                  flex: 1,
                  p: 1
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
