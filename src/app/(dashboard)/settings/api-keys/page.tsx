"use client";

import React, { useState } from "react";
import { Key, Plus, Trash2, Copy, Check, ShieldAlert, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface ApiKeyItem {
  id: string;
  name: string;
  prefix: string;
  createdAt: string;
  lastUsed: string;
}

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKeyItem[]>([
    {
      id: "k1",
      name: "Development CLI",
      prefix: "relix_live_9f83",
      createdAt: "2 weeks ago",
      lastUsed: "Yesterday",
    },
    {
      id: "k2",
      name: "CI/CD Test Runner",
      prefix: "relix_live_4b1a",
      createdAt: "1 month ago",
      lastUsed: "4 hours ago",
    },
  ]);

  const [creating, setCreating] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;

    const fullKey = `relix_live_${Math.random().toString(36).slice(2)}${Math.random().toString(36).slice(2)}`;
    const prefix = fullKey.slice(0, 15);

    const newEntry: ApiKeyItem = {
      id: `k-${Date.now()}`,
      name: newKeyName.trim(),
      prefix,
      createdAt: "Just now",
      lastUsed: "Never",
    };

    setKeys([newEntry, ...keys]);
    setGeneratedKey(fullKey);
    setNewKeyName("");
    setCreating(false);
  };

  const handleDelete = (id: string) => {
    setKeys(keys.filter((k) => k.id !== id));
  };

  const handleCopy = async () => {
    if (!generatedKey) return;
    await navigator.clipboard.writeText(generatedKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 md:p-8 max-w-[800px] mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-[#1c1a18] mb-1">API Keys</h1>
          <p className="text-sm text-[#6b6460]">Authenticate programmatic requests to the Relix generation API.</p>
        </div>
        <Button onClick={() => setCreating(true)} size="md" id="api-key-create-btn">
          <Plus className="h-4 w-4" />
          Create new key
        </Button>
      </div>

      {/* Warning banner when key is created */}
      {generatedKey && (
        <div className="rounded-xl border border-[#d4e5d0] bg-[#eef3ec] p-5 mb-6">
          <div className="flex items-center gap-2 text-[#2c4f38] font-semibold text-sm mb-2">
            <ShieldAlert className="h-4 w-4 text-[#4a7c59]" />
            Save your key securely — it will not be displayed again
          </div>
          <div className="flex items-center gap-2">
            <code className="flex-1 bg-white border border-[#c8c0b4] rounded-lg px-3.5 py-2 text-xs font-mono text-[#1c1a18] select-all">
              {generatedKey}
            </code>
            <Button onClick={handleCopy} size="sm" variant="forest" id="api-key-copy-btn">
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>
        </div>
      )}

      {/* Creation Modal / Inline Form */}
      {creating && (
        <form onSubmit={handleCreate} className="rounded-xl border border-[#6366f1] bg-white p-6 mb-6 shadow-md flex flex-col gap-4">
          <h2 className="font-semibold text-[#1c1a18]">Generate new API secret</h2>
          <Input
            id="key-name"
            label="Key description / identifier"
            placeholder="e.g. Staging Seed Pipeline"
            value={newKeyName}
            onChange={(e) => setNewKeyName(e.target.value)}
            required
            autoFocus
          />
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" size="sm" onClick={() => setCreating(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" id="api-key-save-btn">
              Create key
            </Button>
          </div>
        </form>
      )}

      {/* Keys List */}
      <div className="rounded-xl border border-[#e8e4dc] bg-white overflow-hidden shadow-sm mb-8">
        <div className="px-5 py-4 border-b border-[#e8e4dc] flex items-center justify-between">
          <h2 className="font-semibold text-[#1c1a18]">Active API keys</h2>
          <Badge variant="secondary">{keys.length} keys</Badge>
        </div>

        {keys.length === 0 ? (
          <div className="p-8 text-center text-sm text-[#6b6460]">
            No active API keys found. Create one to use Relix from your terminal or CI.
          </div>
        ) : (
          <div className="divide-y divide-[#f4f0e8]">
            {keys.map((k) => (
              <div key={k.id} className="p-5 flex items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#f4f0e8] flex items-center justify-center text-[#6b6460] shrink-0 mt-0.5">
                    <Key className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[#1c1a18]">{k.name}</h3>
                    <code className="text-xs text-[#6b6460] font-mono mt-0.5 block">{k.prefix}••••••••••••</code>
                    <p className="text-[0.7rem] text-[#c8c0b4] mt-1">
                      Created {k.createdAt} · Last used: {k.lastUsed}
                    </p>
                  </div>
                </div>

                <Button
                  onClick={() => handleDelete(k.id)}
                  variant="ghost"
                  size="icon"
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  aria-label={`Revoke ${k.name} key`}
                  id={`delete-key-${k.id}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Code snippet reference */}
      <div className="rounded-xl border border-[#e8e4dc] bg-[#faf8f4] p-5">
        <div className="flex items-center gap-2 mb-2 text-sm font-semibold text-[#1c1a18]">
          <Code className="h-4 w-4 text-[#6366f1]" />
          Example API Usage
        </div>
        <pre className="code-panel p-4 text-xs font-mono overflow-auto text-[#e2ddd6]">
{`curl -X POST https://api.relix.dev/v1/generate \\
  -H "Authorization: Bearer relix_live_..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "schema": "CREATE TABLE users (id UUID PRIMARY KEY, name TEXT);",
    "seed": 42,
    "format": "typescript-drizzle"
  }'`}
        </pre>
      </div>
    </div>
  );
}
