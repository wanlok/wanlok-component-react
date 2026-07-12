import { useState } from "react";
import { Divider, Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import { Assignment as AssignmentIcon, Chat as ChatIcon, Edit as EditIcon } from "@mui/icons-material";
import { WModal } from "../../components/WModal";
import { KanbanProject } from "../../services/Types";
import { WButton } from "../../components/WButton";
import { YesNoButtons } from "../../components/YesNoButtons";
import { TextInput } from "../../components/TextInput";
import { getDaysSinceString, getDisplayDateTimeString } from "../../common/DateUtils";
import { StyledContainer } from "../../components/StyledContainer";
import { Discussion } from "../../components/Discussion";
import { bottomSx } from "../../components/LayoutHeader";

const parseContent = (text: string) => {
  const urlRegex = /https?:\/\/[^\s]+/g;
  const parts: (string | JSX.Element)[] = [];
  let lastIndex = 0;
  let match;
  while ((match = urlRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    parts.push(
      <a key={match.index} href={match[0]} target="_blank" rel="noopener noreferrer">
        {match[0]}
      </a>
    );
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }
  return parts;
};

export const ItemModal = ({
  project,
  item,
  onItemChange,
  onRefresh,
  onAddMessage,
  onDeleteMessage,
  onClose
}: {
  project: KanbanProject;
  item: { i: number; j: number };
  onItemChange: (name: string, content: string) => void;
  onRefresh: () => void;
  onAddMessage: (name: string, text: string) => void;
  onDeleteMessage: (messageIndex: number) => void;
  onClose: () => void;
}) => {
  const { breakpoints } = useTheme();
  const mobile = useMediaQuery(breakpoints.down("md"));
  const kanbanItem = project.columns[item.i].items[item.j];
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(kanbanItem.name);
  const [content, setContent] = useState(kanbanItem.content);

  return (
    <WModal
      open={true}
      onClose={onClose}
      titleIcon={<AssignmentIcon sx={{ fontSize: 24 }} />}
      title={isEditing ? "Edit Task" : "Task"}
      top={
        <Stack sx={{ flex: 1, p: 2 }}>
          <Typography variant="body1">
            Created at {getDisplayDateTimeString(new Date(kanbanItem.created_at))} (
            {getDaysSinceString(new Date(kanbanItem.created_at))})
          </Typography>
        </Stack>
      }
      bottom={
        <Stack sx={[bottomSx, { flex: 1, gap: "1px" }]}>
          {isEditing ? (
            <YesNoButtons
              yesLabel="Save"
              onYesClick={() => {
                onItemChange(name, content);
                setIsEditing(false);
              }}
              noLabel="Cancel"
              onNoClick={() => setIsEditing(false)}
            />
          ) : (
            <WButton
              onClick={() => setIsEditing(true)}
              rightIcon={<EditIcon sx={{ fontSize: 18, mt: "-2px" }} />}
              sx={{ flex: 1 }}
            >
              Edit
            </WButton>
          )}
        </Stack>
      }
      right={
        <Discussion
          titleIcon={mobile ? undefined : <ChatIcon sx={{ fontSize: 24 }} />}
          title={
            mobile
              ? undefined
              : `Discussion (${kanbanItem.messages.length} ${kanbanItem.messages.length === 1 ? "Message" : "Messages"})`
          }
          messages={kanbanItem.messages}
          onRefresh={onRefresh}
          onAddMessage={onAddMessage}
          onDeleteMessage={onDeleteMessage}
        />
      }
      rightIcon={<ChatIcon sx={{ fontSize: 24 }} />}
      rightTitle="Discussion"
    >
      {isEditing ? (
        <Stack sx={{ gap: 1, p: 2 }}>
          <StyledContainer sx={{ p: 1 }}>
            <TextInput label="Name" value={name} onChange={setName} hideHelperText={true} inputPropsSx={{ flex: 1 }} />
          </StyledContainer>
          <StyledContainer sx={{ p: 1 }}>
            <TextInput
              label="Content"
              value={content}
              onChange={setContent}
              hideHelperText={true}
              minRows={4}
              inputPropsSx={{ flex: 1 }}
            />
          </StyledContainer>
        </Stack>
      ) : (
        <Stack sx={{ gap: 2, p: 2 }}>
          <Typography variant="body1" sx={{ color: kanbanItem.name ? "text.primary" : "text.disabled" }}>
            {kanbanItem.name || "No name"}
          </Typography>
          <Divider />
          <Typography
            variant="body1"
            component="div"
            sx={{ color: kanbanItem.content ? "text.primary" : "text.disabled", whiteSpace: "pre-wrap" }}
          >
            {kanbanItem.content ? parseContent(kanbanItem.content) : "No content"}
          </Typography>
        </Stack>
      )}
    </WModal>
  );
};
