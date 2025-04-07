
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { availableModels, ModelOption } from '@/lib/openRouter';

interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (modelId: string) => void;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({ selectedModel, onModelChange }) => {
  return (
    <div className="py-4 px-4 text-center">
      <div className="inline-block rounded-full bg-claude-accent/10 px-3 py-1">
        <Select value={selectedModel} onValueChange={onModelChange}>
          <SelectTrigger className="w-[180px] border-none bg-transparent">
            <SelectValue placeholder="Select Model" />
          </SelectTrigger>
          <SelectContent>
            {availableModels.map((model) => (
              <SelectItem key={model.id} value={model.id}>
                <div className="flex flex-col items-start">
                  <span className="font-medium">{model.name}</span>
                  <span className="text-xs text-muted-foreground">{model.description}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ModelSelector;
