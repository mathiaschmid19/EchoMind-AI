
import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { AlertCircle, CheckCircle } from 'lucide-react';

const ApiKeyInput = () => {
  const [apiKey, setApiKey] = useState<string>('');
  const [isKeySet, setIsKeySet] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    const savedKey = localStorage.getItem('openrouter_api_key');
    if (savedKey) {
      setApiKey(savedKey);
      setIsKeySet(true);
    } else {
      setIsVisible(true);
    }
  }, []);

  const handleSaveKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('openrouter_api_key', apiKey.trim());
      setIsKeySet(true);
      setIsVisible(false);
    }
  };

  const handleResetKey = () => {
    localStorage.removeItem('openrouter_api_key');
    setApiKey('');
    setIsKeySet(false);
    setIsVisible(true);
  };

  if (!isVisible && isKeySet) {
    return (
      <div className="fixed top-4 right-4 z-50">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setIsVisible(true)}
          className="flex items-center gap-1"
        >
          <CheckCircle className="h-4 w-4 text-green-500" />
          <span>API Key Set</span>
        </Button>
      </div>
    );
  }

  return (
    <div className={`fixed top-4 right-4 z-50 bg-white p-4 rounded-md shadow-lg border border-gray-200 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'} transition-opacity duration-200`}>
      <div className="flex flex-col gap-2 max-w-xs">
        <h3 className="font-medium flex items-center gap-1">
          <AlertCircle className="h-4 w-4 text-amber-500" />
          OpenRouter API Key
        </h3>
        <p className="text-xs text-gray-500">Enter your OpenRouter API key to enable AI responses.</p>
        <div className="flex gap-2">
          <Input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk_or_..."
            className="text-xs"
          />
          <Button size="sm" onClick={handleSaveKey}>Save</Button>
        </div>
        {isKeySet && (
          <Button variant="ghost" size="sm" onClick={handleResetKey} className="text-xs">
            Reset Key
          </Button>
        )}
        <p className="text-xs text-gray-400 mt-1">
          <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
            Get an API key →
          </a>
        </p>
      </div>
    </div>
  );
};

export default ApiKeyInput;
