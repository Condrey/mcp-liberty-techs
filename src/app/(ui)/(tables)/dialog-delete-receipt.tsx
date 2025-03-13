import LoadingButton from "@/components/loading-button";
import ResponsiveDrawer from "@/components/responsive-drawer";
import { Button } from "@/components/ui/button";
import { Receipt } from "@prisma/client";
import { useDeleteReceiptMutation } from "./mutation";

interface DialogDeleteReceiptProps {
  receipt: Receipt;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function DialogDeleteReceipt({
  receipt: { id, client },
  open,
  setOpen,
}: DialogDeleteReceiptProps) {
  const { mutate, isPending } = useDeleteReceiptMutation();
  return (
    <ResponsiveDrawer open={open} setOpen={setOpen} title="Delete this receipt">
      <span>
        Delete this receipt belonging to {client}. Remember this action can not
        be reversed.
      </span>
      <div className="flex gap-2 justify-end items-center">
        <Button onClick={() => setOpen(false)} variant={"outline"}>
          Cancel
        </Button>
        <LoadingButton
          loading={isPending}
          variant={"destructive"}
          onClick={() =>
            mutate(id, {
              onSuccess: () => setOpen(false),
            })
          }
        >
          Delete
        </LoadingButton>
      </div>
    </ResponsiveDrawer>
  );
}
