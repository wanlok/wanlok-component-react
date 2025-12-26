import { WModal } from "../../components/WModal";

export const KanbanItemModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  return (
    <WModal open={open} onClose={onClose}>
      Hello World
    </WModal>
  );
};
