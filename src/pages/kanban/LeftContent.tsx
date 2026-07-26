import React, { Dispatch, SetStateAction } from "react";
import { Divider, Stack } from "@mui/material";
import { LayoutLoading } from "../../components/LayoutLoading";
import {
  Assignment as AssignmentIcon,
  Chat as ChatIcon,
  Close as CloseIcon,
  ViewKanban as KanbanIcon,
  ViewKanbanOutlined as KanbanOutlinedIcon
} from "@mui/icons-material";
import { getDateString } from "../../common/DateUtils";
import { Kanban, KanbanColumn, KanbanItem, KanbanProject, Message } from "../../services/Types";
import { WCardList } from "../../components/WCardList";
import { iconButtonSx, WButton } from "../../components/WButton";
import { PanelRow } from "../../components/PanelRow";
import { OneLineTypography } from "../../components/OneLineTypography";

const Row = ({ icon, count, dateString }: { icon: React.ReactNode; count: number; dateString?: string }) => (
  <Stack sx={{ flexDirection: "row", px: 2, height: 32, gap: 2, alignItems: "center" }}>
    <Stack sx={{ flexDirection: "row", gap: 1 }}>
      <Stack sx={{ width: 20, alignItems: "center", justifyContent: "center" }}>{icon}</Stack>
      <OneLineTypography variant="body2">{count}</OneLineTypography>
    </Stack>
    {dateString && (
      <>
        <Divider orientation="vertical" flexItem sx={{ my: 1 }} />
        <OneLineTypography variant="body2">{dateString}</OneLineTypography>
      </>
    )}
  </Stack>
);

export const LeftContent = ({
  isLoading,
  kanban,
  selectedProject,
  controlGroupState,
  setPanelOpened,
  openProject,
  deleteProject
}: {
  isLoading: boolean;
  kanban: Kanban | undefined;
  selectedProject: KanbanProject | undefined;
  controlGroupState: number;
  setPanelOpened: Dispatch<SetStateAction<boolean>>;
  openProject: (project: KanbanProject) => void;
  deleteProject: (project: KanbanProject) => Promise<void>;
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
                    (latest: string, item: KanbanItem) => (item.created_at > latest ? item.created_at : latest),
                    allItems[0].created_at
                  )
                )
              )
            : undefined;
        const lastMessageDate =
          allMessages.length > 0
            ? getDateString(
                new Date(
                  allMessages.reduce(
                    (latest: string, msg: Message) => (msg.created_at > latest ? msg.created_at : latest),
                    allMessages[0].created_at
                  )
                )
              )
            : undefined;
        return (
          <PanelRow icon={<Icon sx={{ fontSize: 24 }} />} title={project.name}>
            <Stack sx={{ border: 1, borderColor: "divider" }}>
              <Row icon={<AssignmentIcon sx={{ fontSize: 18 }} />} count={numberOfTasks} dateString={lastTaskDate} />
              <Divider />
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
        openProject(project);
        setPanelOpened(false);
      }}
      renderRightContent={(project) => (
        <Stack>
          {controlGroupState === 1 && (
            <WButton onClick={() => deleteProject(project)} sx={{ ...iconButtonSx, backgroundColor: "transparent" }}>
              <CloseIcon sx={{ fontSize: 24 }} />
            </WButton>
          )}
        </Stack>
      )}
    />
  );
};
