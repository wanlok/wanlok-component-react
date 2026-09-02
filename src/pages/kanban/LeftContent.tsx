import { Dispatch, ReactNode, SetStateAction } from "react";
import { Divider, Stack } from "@mui/material";
import { LayoutLoading } from "../../components/LayoutLoading";
import {
  Assignment as AssignmentIcon,
  Chat as ChatIcon,
  Close as CloseIcon,
  ViewKanban as KanbanIcon,
  ViewKanbanOutlined as KanbanOutlinedIcon
} from "@mui/icons-material";
import { getDateString } from "../../utils/DateUtils";
import { Kanban, KanbanColumn, KanbanItem, KanbanProject, Message } from "../../services/Types";
import { WCardList } from "../../components/WCardList";
import { iconButtonSx, WButton } from "../../components/WButton";
import { PanelRow } from "../../components/PanelRow";
import { OneLineTypography } from "../../components/OneLineTypography";

const Row = ({ icon, count, dateString }: { icon: ReactNode; count: number; dateString?: string }) => (
  <>
    <Stack sx={{ flexDirection: "row", gap: 1, px: 2, py: 1, alignItems: "center" }}>
      <Stack sx={{ width: 20, alignItems: "center", justifyContent: "center" }}>{icon}</Stack>
      <OneLineTypography variant="body2">{count}</OneLineTypography>
    </Stack>
    {dateString ? (
      <>
        <Divider orientation="vertical" sx={{ alignSelf: "stretch", height: "auto", my: 1 }} />
        <OneLineTypography variant="body2" sx={{ px: 2, alignSelf: "center" }}>
          {dateString}
        </OneLineTypography>
      </>
    ) : (
      <>
        <span />
        <span />
      </>
    )}
  </>
);

export const LeftContent = ({
  isLoading,
  kanban,
  selectedProject,
  controlGroupState,
  setPanelOpened,
  openProject,
  onDeleteProjectButtonClick
}: {
  isLoading: boolean;
  kanban: Kanban | undefined;
  selectedProject: KanbanProject | undefined;
  controlGroupState: number;
  setPanelOpened: Dispatch<SetStateAction<boolean>>;
  openProject: (project: KanbanProject) => void;
  onDeleteProjectButtonClick: (project: KanbanProject) => void;
}) => {
  if (isLoading) {
    return <LayoutLoading />;
  }
  return (
    <WCardList
      items={kanban?.projects ?? []}
      renderContent={(project) => {
        const Icon = project.id === selectedProject?.id ? KanbanIcon : KanbanOutlinedIcon;
        const allItems = project.columns.flatMap((column: KanbanColumn) => column.items);
        const allMessages = allItems.flatMap((item: KanbanItem) => item.messages);
        const numberOfTasks = allItems.length;
        const numberOfMessages = allMessages.length;
        const lastTaskDate =
          allItems.length > 0
            ? getDateString(
                new Date(
                  allItems.reduce(
                    (latest: string, item: KanbanItem) => (item.createdAt > latest ? item.createdAt : latest),
                    allItems[0].createdAt
                  )
                )
              )
            : undefined;
        const lastMessageDate =
          allMessages.length > 0
            ? getDateString(
                new Date(
                  allMessages.reduce(
                    (latest: string, msg: Message) => (msg.createdAt > latest ? msg.createdAt : latest),
                    allMessages[0].createdAt
                  )
                )
              )
            : undefined;
        return (
          <PanelRow icon={<Icon sx={{ fontSize: 24 }} />} title={project.name}>
            <Stack sx={{ border: 1, borderColor: "divider", display: "grid", gridTemplateColumns: "auto 1px 1fr" }}>
              <Row icon={<AssignmentIcon sx={{ fontSize: 18 }} />} count={numberOfTasks} dateString={lastTaskDate} />
              <Divider sx={{ gridColumn: "1 / -1" }} />
              <Row
                icon={<ChatIcon sx={{ fontSize: 18, mt: 0.2 }} />}
                count={numberOfMessages}
                dateString={lastMessageDate}
              />
            </Stack>
          </PanelRow>
        );
      }}
      onContentClick={(project) => {
        if (project) {
          openProject(project);
        }
        setPanelOpened(false);
      }}
      renderRightContent={(project) => (
        <Stack>
          {controlGroupState === 1 && (
            <WButton
              onClick={() => onDeleteProjectButtonClick(project)}
              sx={{ ...iconButtonSx, backgroundColor: "transparent", "&:hover": { backgroundColor: "action.hover" } }}
            >
              <CloseIcon sx={{ fontSize: 24 }} />
            </WButton>
          )}
        </Stack>
      )}
    />
  );
};
