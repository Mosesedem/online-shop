"use client";

import { Button } from "@/components/ui/button";
import { X, Trash2, Edit, Download } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface BulkActionBarProps {
  selectedCount: number;
  onClearSelection: () => void;
  onBulkDelete?: () => void;
  onBulkUpdate?: () => void;
  onExport?: () => void;
  customActions?: Array<{
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
    variant?: "default" | "destructive";
  }>;
}

export function BulkActionBar({
  selectedCount,
  onClearSelection,
  onBulkDelete,
  onBulkUpdate,
  onExport,
  customActions,
}: BulkActionBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-5">
      <div className="bg-card border rounded-lg shadow-lg p-4 flex items-center gap-4">
        <span className="font-semibold">
          {selectedCount} {selectedCount === 1 ? "item" : "items"} selected
        </span>

        <div className="flex items-center gap-2">
          {onBulkUpdate && (
            <Button size="sm" variant="outline" onClick={onBulkUpdate}>
              <Edit className="w-4 h-4 mr-2" />
              Update
            </Button>
          )}

          {onExport && (
            <Button size="sm" variant="outline" onClick={onExport}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          )}

          {customActions && customActions.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="outline">
                  More Actions
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {customActions.map((action, index) => (
                  <DropdownMenuItem
                    key={index}
                    onClick={action.onClick}
                    className={action.variant === "destructive" ? "text-destructive" : ""}
                  >
                    {action.icon && <span className="mr-2">{action.icon}</span>}
                    {action.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {onBulkDelete && (
            <Button size="sm" variant="destructive" onClick={onBulkDelete}>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          )}

          <Button size="sm" variant="ghost" onClick={onClearSelection}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
