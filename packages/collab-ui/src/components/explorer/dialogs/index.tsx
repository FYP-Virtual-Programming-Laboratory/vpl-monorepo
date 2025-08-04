import { DeleteFileDialog } from "./delete-file-dialog";
import { NewFileDialog } from "./new-file-dialog";
import { RevertFileDialog } from "./revert-file-dialog";

export function ExplorerDialogs() {
  return (
    <div>
      <NewFileDialog />
      <DeleteFileDialog />
      <RevertFileDialog />
    </div>
  );
}
