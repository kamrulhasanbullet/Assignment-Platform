"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { Label } from "@/src/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { useToast } from "@/src/components/ui/use-toast";
import { Calendar } from "@/src/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon, Wand2 } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/popover";
import { cn } from "@/src/lib/utils";
import { Button as CalendarButton } from "@/src/components/ui/button";

interface AssignmentFormProps {
  onSubmit: (formData: FormData) => Promise<void>;
  loading?: boolean;
  onImproveDescription?: (description: string) => Promise<void>;
  aiSuggestion?: string;
}

export default function AssignmentForm({
  onSubmit,
  loading = false,
  onImproveDescription,
  aiSuggestion = "",
}: AssignmentFormProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [date, setDate] = useState<Date>();
  const [description, setDescription] = useState(aiSuggestion || "");

  const handleSubmit = (form: HTMLFormElement) => {
    startTransition(async () => {
      const formData = new FormData(form);
      formData.append("deadline", date?.toISOString() || "");
      try {
        await onSubmit(formData);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to create assignment",
          variant: "destructive",
        });
      }
    });
  };

  const handleAIImprove = async () => {
    if (onImproveDescription && description.trim()) {
      try {
        await onImproveDescription(description);
      } catch (error) {
        toast({
          title: "AI Error",
          description: "Failed to improve description",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            required
            placeholder="Enter assignment title"
            className="h-12"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="difficulty">Difficulty Level</Label>
          <Select name="difficulty" required>
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Select difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 mb-2">
          <Label htmlFor="description" className="text-sm font-medium">
            Description
          </Label>
          {onImproveDescription && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAIImprove}
              disabled={!description.trim() || isPending}
              className="h-8 gap-1"
            >
              <Wand2 className="w-3 h-3" />
              Improve
            </Button>
          )}
        </div>
        <Textarea
          id="description"
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          placeholder="Describe what students need to do..."
          rows={8}
          className="min-h-[120px]"
        />
        {aiSuggestion && (
          <p className="text-xs text-muted-foreground mt-1">
            ✨ AI improved this description
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Deadline</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="deadline"
              variant="outline"
              className={cn(
                "w-full h-12 justify-start text-left font-normal",
                !date && "text-muted-foreground",
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
              fromDate={new Date()}
            />
          </PopoverContent>
        </Popover>
      </div>

      <Button
        type="submit"
        className="w-full h-12 text-lg"
        disabled={isPending || loading}
      >
        {isPending ? "Creating..." : "Create Assignment"}
      </Button>
    </form>
  );
}
