'use client';

import { useState } from 'react';
import { Copy, Check, Lock, Code, Shield } from 'lucide-react';

export default function Home() {
  const [script, setScript] = useState('');
  const [generatedUrl, setGeneratedUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCreateScript = async () => {
    if (!script.trim()) {
      alert('Please enter a script!');
      return;
    }

    setLoading(true);
    
    try {
      const res = await fetch('/api/raw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ script })
      });

      const data = await res.json();
      
      if (data.success) {
        setGeneratedUrl(`${window.location.origin}/api/raw/${data.hash}`);
      } else {
        alert('Failed to create script: ' + data.message);
      }
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="w-12 h-12 text-purple-400" />
            <h1 className="text-5xl font-bold text-white">Script Protector</h1>
          </div>
          <p className="text-purple-300 text-lg">
            Protect your scripts - accessible only via executors and HTTP clients
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-purple-500/20 p-8">
          {/* Input Section */}
          <div className="mb-6">
            <label className="flex items-center gap-2 text-white font-semibold mb-3">
              <Code className="w-5 h-5 text-purple-400" />
              Your Script Code
            </label>
            <textarea
              value={script}
              onChange={(e) => setScript(e.target.value)}
              placeholder="-- Paste your script here&#x0a;print('Hello World')&#x0a;&#x0a;-- Browser access will show: ACCESS DENIED"
              className="w-full h-64 bg-slate-900/80 text-green-400 font-mono text-sm rounded-lg p-4 border border-purple-500/30 focus:border-purple-500 focus:outline-none resize-none"
            />
          </div>

          {/* Create Button */}
          <button
            onClick={handleCreateScript}
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-purple-500/50"
          >
            <Lock className="w-5 h-5" />
            {loading ? 'Creating Protected URL...' : 'Create Protected Script'}
          </button>

          {/* Generated URL Section */}
          {generatedUrl && (
            <div className="mt-8 space-y-4">
              <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-lg p-6">
                <h3 className="text-green-400 font-semibold mb-3 flex items-center gap-2">
                  <Check className="w-5 h-5" />
                  Protected URL Created Successfully!
                </h3>
                
                <div className="bg-slate-900/80 rounded-lg p-4 mb-4">
                  <p className="text-xs text-gray-400 mb-2">Raw URL (protected from browser access):</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 text-purple-300 text-sm break-all">
                      {generatedUrl}
                    </code>
                    <button
                      onClick={copyToClipboard}
                      className="p-2 hover:bg-slate-700 rounded transition-colors"
                      title="Copy URL"
                    >
                      {copied ? (
                        <Check className="w-5 h-5 text-green-400" />
                      ) : (
                        <Copy className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="text-yellow-300 text-sm font-semibold mb-2">⚠️ Important:</p>
                  <ul className="text-yellow-200/80 text-xs space-y-1 list-disc list-inside">
                    <li>Opening this URL in browser will show: <code className="bg-slate-900 px-2 py-0.5 rounded">ACCESS DENIED</code></li>
                    <li>Can only be accessed via script executors, HTTP clients, or cURL</li>
                    <li>Works with game executors (Roblox, FiveM, etc)</li>
                    <li>No API key required - just paste the URL!</li>
                  </ul>
                </div>
              </div>

              {/* Example Usage */}
              <details className="bg-slate-900/50 rounded-lg border border-purple-500/20">
                <summary className="cursor-pointer p-4 text-purple-300 font-semibold hover:text-purple-200">
                  📖 Example Usage (Click to expand)
                </summary>
                <div className="p-4 pt-0 space-y-3">
                  <div>
                    <p className="text-gray-400 text-xs mb-2">Lua (Roblox Executor):</p>
                    <pre className="bg-slate-950 text-green-400 text-xs p-3 rounded overflow-x-auto">
{`loadstring(game:HttpGet('${generatedUrl}'))()`}
                    </pre>
                  </div>

                  <div>
                    <p className="text-gray-400 text-xs mb-2">cURL (Terminal):</p>
                    <pre className="bg-slate-950 text-green-400 text-xs p-3 rounded overflow-x-auto">
{`curl ${generatedUrl}`}
                    </pre>
                  </div>
                  
                  <div>
                    <p className="text-gray-400 text-xs mb-2">JavaScript (Node.js):</p>
                    <pre className="bg-slate-950 text-green-400 text-xs p-3 rounded overflow-x-auto">
{`fetch('${generatedUrl}')
  .then(res => res.text())
  .then(script => console.log(script));`}
                    </pre>
                  </div>

                  <div>
                    <p className="text-gray-400 text-xs mb-2">Python:</p>
                    <pre className="bg-slate-950 text-green-400 text-xs p-3 rounded overflow-x-auto">
{`import requests
response = requests.get('${generatedUrl}')
print(response.text)`}
                    </pre>
                  </div>
                </div>
              </details>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center text-purple-300/60 text-sm">
          <p>🔒 Scripts are protected from browser access</p>
          <p className="mt-2">Scripts expire after 30 days</p>
        </div>
      </div>
    </div>
  );
    }
