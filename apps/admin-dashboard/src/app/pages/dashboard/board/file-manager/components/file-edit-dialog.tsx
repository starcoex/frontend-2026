import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FileWithUrl } from '@starcoex-frontend/graphql';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useMedia } from '@starcoex-frontend/media';

interface FileEditDialogProps {
  file: FileWithUrl | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FileEditDialog({
  file,
  open,
  onOpenChange,
}: FileEditDialogProps) {
  const { updateFile, isLoading } = useMedia();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (file) {
      setName(file.originalName || '');
      setDescription(file.description || '');
    }
  }, [file]);

  const handleSave = async () => {
    if (!file) return;

    const result = await updateFile({
      fileId: file.id,
      originalName: name,
      description: description,
    });

    if (result.success) {
      toast.success('파일 정보가 수정되었습니다.');
      onOpenChange(false);
    } else {
      toast.error(result.error?.message || '수정에 실패했습니다.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit File Info</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">File Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="desc">Description</Label>
            <Textarea
              id="desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter file description..."
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
