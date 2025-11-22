import { Stack, Typography } from "@mui/material";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { CloudinaryFileInfo, Folder } from "../../services/Types";
import { WModal } from "../../components/WModal";
import { WText } from "../../components/WText";
import { TextInput } from "../../components/TextInput";
import { WButton } from "../../components/WButton";

export const Dummy2 = ({
  files,
  collectionTypeId,
  setCollectionTypeId,
  selectedFolder,
  updateCollectionAttributes
}: {
  files: [string, CloudinaryFileInfo][];
  collectionTypeId: { type: string; id: string } | undefined;
  setCollectionTypeId: Dispatch<SetStateAction<{ type: string; id: string } | undefined>>;
  selectedFolder?: Folder;
  updateCollectionAttributes: (
    type: string,
    id: string,
    attributes: {
      [key: string]: string;
    }
  ) => Promise<void>;
}) => {
  const [attributes, setAttributes] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (collectionTypeId) {
      const { type, id } = collectionTypeId;
      if (type === "files") {
        const file = files.find(([fileId, _]) => fileId === id);
        if (file) {
          const [, fileInfo] = file;
          if (fileInfo.attributes) {
            setAttributes(fileInfo.attributes);
          }
        }
      }
    }
  }, [collectionTypeId]);

  return (
    <WModal open={collectionTypeId !== undefined} onClose={() => setCollectionTypeId(undefined)}>
      <WText text="Attributes" editable={false} rightButtons={[]} />
      {selectedFolder?.attributes.map(({ name }, i) => {
        return (
          <Stack key={`attribute-${i}`} sx={{ flexDirection: "row", backgroundColor: "background.default" }}>
            <Stack sx={{ flex: 1 }}>
              <Typography>{name}</Typography>
            </Stack>
            <Stack sx={{ flex: 1 }}>
              <TextInput
                value={attributes[name]}
                onChange={(value) => {
                  const newAttributes = { ...attributes };
                  newAttributes[name] = value;
                  setAttributes(newAttributes);
                }}
                hideHelperText={true}
                inputPropsSx={{ flex: 1 }}
              />
            </Stack>
          </Stack>
        );
      })}
      <WButton
        onClick={async () => {
          if (collectionTypeId) {
            const { type, id } = collectionTypeId;
            await updateCollectionAttributes(type, id, attributes);
          }
        }}
      >
        Save
      </WButton>
    </WModal>
  );
};
