import React from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogTrigger,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { handleError } from "@/lib/helpers";

function DeleteSchool({
  schoolId,
  onDelete,
}: {
  schoolId: number;
  onDelete: () => Promise<void>;
}) {
  const handleDelete = async () => {
    try {
      const { data } = await axios.delete(`/api/school/${schoolId}`);
      if (data.success) {
        toast.success("School was deleted");
        onDelete();
      }
    } catch (error) {
      const message = handleError(error);
      toast.error(message);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Trash2 /> Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogTitle>Delete School</AlertDialogTitle>
        <AlertDialogDescription>
          Are you sure you want to delete this school? This action cannot be
          undone.
        </AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-white hover:bg-destructive/80"
            onClick={handleDelete}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeleteSchool;
