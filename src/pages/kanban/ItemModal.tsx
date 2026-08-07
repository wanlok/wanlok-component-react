import { ReactElement, useState } from "react";
import { Divider, Stack, Typography } from "@mui/material";
import { Assignment as AssignmentIcon, Chat as ChatIcon, Edit as EditIcon } from "@mui/icons-material";
import { WModal } from "../../components/WModal";
import { KanbanProject } from "../../services/Types";
import { WButton } from "../../components/WButton";
import { YesNoButtons } from "../../components/YesNoButtons";
import { TextInput } from "../../components/TextInput";
import { getDaysSinceString, getDisplayDateTimeString } from "../../common/DateUtils";
import { applyCorrections, checkGrammar } from "../../services/GrammarService";
import { StyledContainer } from "../../components/StyledContainer";
import { DiscussionTop, DiscussionBottom, DiscussionMessages } from "../../components/Discussion";
import { useDiscussion } from "../../components/useDiscussion";
import { bottomSx, topSx } from "../../components/LayoutHeader";
import { SelectInput } from "../../components/SelectInput";

const parseContent = (text: string) => {
  const urlRegex = /https?:\/\/[^\s]+/g;
  const parts: (string | ReactElement)[] = [];
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
  onMoveItem,
  onRefresh,
  onAddMessage,
  onDeleteMessage,
  onClose
}: {
  project: KanbanProject;
  item: { i: number; j: number };
  onItemChange: (name: string, content: string) => void;
  onMoveItem: (targetColumnIndex: number) => void;
  onRefresh: () => void;
  onAddMessage: (name: string, text: string) => void;
  onDeleteMessage: (messageIndex: number) => void;
  onClose: () => void;
}) => {
  const kanbanItem = project.columns[item.i].items[item.j];
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(kanbanItem.name);
  const [content, setContent] = useState(kanbanItem.content);
  const [selectedColumn, setSelectedColumn] = useState(String(item.i));
  const [nameHint, setNameHint] = useState("");
  const [contentHint, setContentHint] = useState("");
  const [mobileSelectedTab, setMobileSelectedTab] = useState(0);
  const { isDeletingMessages, name: discussionName, onNameChange, onSendMessage, onToggleDeleteMessages, stackRef } = useDiscussion({
    messages: kanbanItem.messages,
    onAddMessage
  });

  return (
    <WModal
      mobileSelectedTab={mobileSelectedTab}
      onMobileSelectedTabChange={setMobileSelectedTab}
      open={true}
      onClose={onClose}
      tabs={[{ icon: <AssignmentIcon sx={{ fontSize: 24 }} />, label: isEditing ? "Edit Task" : "Task" }]}
      rightTabs={[{ icon: <ChatIcon sx={{ fontSize: 24 }} />, label: "Discussion" }]}
      top={
        <StyledContainer sx={{ flex: 1, p: 1 }}>
          <SelectInput
            items={project.columns.map((column, i) => ({ label: column.name, value: String(i) }))}
            value={selectedColumn}
            onChange={(value) => {
              const targetColumnIndex = Number(value);
              if (targetColumnIndex !== item.i) {
                setSelectedColumn(value);
                onMoveItem(targetColumnIndex);
              }
            }}
          />
        </StyledContainer>
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
              rightIcon={<EditIcon sx={{ fontSize: 18, mt: -0.1 }} />}
              sx={{ flex: 1 }}
            >
              Edit
            </WButton>
          )}
        </Stack>
      }
      rightTop={
        <DiscussionTop
          name={discussionName}
          onNameChange={onNameChange}
          onRefresh={onRefresh}
          onToggleDeleteMessages={onToggleDeleteMessages}
        />
      }
      rightBottom={<DiscussionBottom onSendMessage={onSendMessage} />}
      rightChildren={
        <DiscussionMessages
          messages={kanbanItem.messages}
          isDeletingMessages={isDeletingMessages}
          onDeleteMessage={onDeleteMessage}
          stackRef={stackRef}
        />
      }
    >
      <Stack sx={{ p: 2 }}>
        <Typography variant="body2" sx={{ textAlign: "right" }}>
          {getDisplayDateTimeString(new Date(kanbanItem.createdAt))} (
          {getDaysSinceString(new Date(kanbanItem.createdAt))})
        </Typography>
      </Stack>
      <Stack sx={{ gap: "1px", px: 2, pb: 2 }}>
        {isEditing ? (
          <>
            <StyledContainer sx={{ p: 1 }}>
              <TextInput
                label="Name"
                value={name}
                onChange={setName}
                helperText={nameHint}
                inputSx={{ flex: 1 }}
              />
            </StyledContainer>
            <StyledContainer sx={{ p: 1 }}>
              <TextInput
                label="Content"
                value={content}
                onChange={setContent}
                helperText={contentHint}
                minRows={4}
                inputSx={{ flex: 1 }}
              />
            </StyledContainer>
            <Stack sx={[topSx, { gap: "1px" }]}>
              <WButton
                onClick={async () => {
                  const [nameMatches, contentMatches] = await Promise.all([checkGrammar(name), checkGrammar(content)]);
                  setNameHint(applyCorrections(name, nameMatches));
                  setContentHint(applyCorrections(content, contentMatches));
                }}
              >
                Grammer Check
              </WButton>
              <WButton
                onClick={() => {
                  setNameHint("");
                  setContentHint("");
                }}
              >
                Clear
              </WButton>
            </Stack>
          </>
        ) : (
          <Stack sx={{ gap: 2 }}>
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
      </Stack>
    </WModal>
  );
};
