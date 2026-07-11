import { useState } from "react";
import { Divider, Stack, Typography } from "@mui/material";
import { Chat as ChatIcon, Close as CloseIcon, Edit as EditIcon, ViewList as ViewListIcon } from "@mui/icons-material";
import { WModal } from "../../components/WModal";
import { KanbanProject, Message } from "../../services/Types";
import { WButton } from "../../components/WButton";
import { YesNoButtons } from "../../components/YesNoButtons";
import { TextInput } from "../../components/TextInput";
import { getDaysSinceString, getDisplayDateTimeString } from "../../common/DateUtils";
import { WText } from "../../components/WText";
import { Send as SendIcon } from "@mui/icons-material";

const DiscussionContent = ({ messages }: { messages: Message[] }) => (
  <Stack sx={{ gap: 1 }}>
    {messages.length === 0 ? (
      <Typography variant="body2" sx={{ color: "text.disabled" }}>
        No messages yet
      </Typography>
    ) : (
      messages.map((message, i) => (
        <Stack key={i} sx={{ gap: 0.5 }}>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            {getDisplayDateTimeString(new Date(message.created_at))}
          </Typography>
          <Typography variant="body2">{message.text}</Typography>
        </Stack>
      ))
    )}
  </Stack>
);

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
  onAddMessage,
  onClose
}: {
  project: KanbanProject;
  item: { i: number; j: number };
  onItemChange: (name: string, content: string) => void;
  onAddMessage: (text: string) => void;
  onClose: () => void;
}) => {
  const kanbanItem = project.columns[item.i].items[item.j];
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(kanbanItem.name);
  const [content, setContent] = useState(kanbanItem.content);

  return (
    <WModal
      open={true}
      onClose={onClose}
      titleIcon={<ViewListIcon sx={{ fontSize: 24 }} />}
      title={isEditing ? "Edit Item" : "View Item"}
      bottom={
        isEditing ? (
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
          <>
            <WButton
              onClick={() => setIsEditing(true)}
              rightIcon={<EditIcon sx={{ fontSize: 18, mt: "-2px" }} />}
              sx={{ flex: 1 }}
            >
              Edit
            </WButton>
            <WButton onClick={onClose} rightIcon={<CloseIcon sx={{ fontSize: 24, mt: "-2px" }} />} sx={{ flex: 1 }}>
              Close
            </WButton>
          </>
        )
      }
      right={{
        titleIcon: <ChatIcon sx={{ fontSize: 24 }} />,
        title: "Discussion",
        bottom: (
          <Stack sx={{ flex: 1 }}>
            <WText
              placeholder="Add a comment"
              rightButtons={[{ icon: <SendIcon sx={{ fontSize: 20 }} />, onClickWithText: (text) => onAddMessage(text) }]}
            />
          </Stack>
        ),
        children: <DiscussionContent messages={kanbanItem.messages} />
      }}
    >
      {isEditing ? (
        <Stack sx={{ gap: 1 }}>
          <TextInput label="Name" value={name} onChange={setName} hideHelperText={true} inputPropsSx={{ flex: 1 }} />
          <TextInput
            label="Created Date"
            value={getDisplayDateTimeString(new Date(kanbanItem.created_at))}
            onChange={() => {}}
            hideHelperText={true}
            inputPropsSx={{ flex: 1 }}
            disabled={true}
          />
          <TextInput
            label="Content"
            value={content}
            onChange={setContent}
            hideHelperText={true}
            minRows={4}
            inputPropsSx={{ flex: 1 }}
          />
        </Stack>
      ) : (
        <Stack sx={{ gap: 2 }}>
          <Typography variant="h6" sx={{ color: kanbanItem.name ? "text.primary" : "text.disabled" }}>
            {kanbanItem.name || "No name"}
          </Typography>
          <Divider />
          <Stack sx={{ flexDirection: "row" }}>
            <Typography variant="body2" sx={{ flex: 0.28 }}>
              Created Date
            </Typography>
            <Typography variant="body2" sx={{ flex: 0.72 }}>
              {getDisplayDateTimeString(new Date(kanbanItem.created_at))} (
              {getDaysSinceString(new Date(kanbanItem.created_at))})
            </Typography>
          </Stack>
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
