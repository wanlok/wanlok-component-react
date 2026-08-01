import { Stack, Typography } from "@mui/material";
import { SelectInput } from "../../../components/SelectInput";
import { useQuiz } from "./useQuiz";

export const Quiz = () => {
  const { folderItems, collectionId, setCollectionId, quiz } = useQuiz();

  return (
    <Stack sx={{ flex: 1, minHeight: 0 }}>
      <SelectInput items={folderItems} value={collectionId} onChange={setCollectionId} />
      {collectionId && (
        <Stack sx={{ flex: 1, overflow: "auto" }}>
          <Typography component="pre" variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
            {JSON.stringify(quiz, null, 2)}
          </Typography>
        </Stack>
      )}
    </Stack>
  );
};
