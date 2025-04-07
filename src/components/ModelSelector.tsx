
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
  // Find the selected model name
  const selectedModelName = availableModels.find(model => model.id === selectedModel)?.name || '';
  
  return (
    <div className="py-4 px-4">
      <div className="inline-block rounded-full bg-purple-600/80 px-3 py-1">
        <Select value={selectedModel} onValueChange={onModelChange}>
          <SelectTrigger className="w-[180px] border-none bg-transparent text-white">
            <SelectValue placeholder="Select Model">
              {selectedModelName}
            </SelectValue>
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
