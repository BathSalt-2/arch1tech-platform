import React, { useState } from 'react';
import { Database, Zap, Settings, Play, Download, Copy, AlertCircle } from 'lucide-react';

interface DataSchema {
  fieldName: string;
  dataType: 'string' | 'number' | 'boolean' | 'date' | 'email' | 'json';
  description: string;
}

interface GenerationResult {
  id: string;
  timestamp: string;
  recordCount: number;
  status: 'generating' | 'success' | 'error';
  records: Record<string, any>[];
  error?: string;
}

export default function SyntheticDataForgeTab() {
  const [datasetName, setDatasetName] = useState('synthetic-dataset');
  const [recordCount, setRecordCount] = useState(100);
  const [schemas, setSchemas] = useState<DataSchema[]>([
    { fieldName: 'id', dataType: 'string', description: 'Unique identifier' },
    { fieldName: 'name', dataType: 'string', description: 'Person or entity name' },
    { fieldName: 'email', dataType: 'email', description: 'Email address' },
    { fieldName: 'timestamp', dataType: 'date', description: 'Creation timestamp' },
  ]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<GenerationResult | null>(null);
  const [dataFormat, setDataFormat] = useState<'json' | 'csv'>('json');

  const addSchema = () => {
    setSchemas([
      ...schemas,
      { fieldName: `field_${schemas.length}`, dataType: 'string', description: '' },
    ]);
  };

  const removeSchema = (index: number) => {
    setSchemas(schemas.filter((_, i) => i !== index));
  };

  const updateSchema = (index: number, field: keyof DataSchema, value: any) => {
    const updated = [...schemas];
    updated[index] = { ...updated[index], [field]: value };
    setSchemas(updated);
  };

  const generateData = async () => {
    setIsGenerating(true);
    try {
      // Simulate API call to generate synthetic data
      // In production, this would call a backend service
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const mockRecords = Array.from({ length: Math.min(recordCount, 20) }, (_, i) => ({
        id: `id_${String(i + 1).padStart(5, '0')}`,
        name: `Generated_Name_${i + 1}`,
        email: `user${i + 1}@synthetic.ai`,
        timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString(),
        ...Object.fromEntries(
          schemas.slice(4).map((schema) => [
            schema.fieldName,
            schema.dataType === 'number'
              ? Math.floor(Math.random() * 10000)
              : schema.dataType === 'boolean'
              ? Math.random() > 0.5
              : `${schema.fieldName}_value_${i + 1}`,
          ])
        ),
      }));

      setResults({
        id: `sdg_${Date.now()}`,
        timestamp: new Date().toISOString(),
        recordCount,
        status: 'success',
        records: mockRecords,
      });
    } catch (error) {
      setResults({
        id: `sdg_${Date.now()}`,
        timestamp: new Date().toISOString(),
        recordCount: 0,
        status: 'error',
        records: [],
        error: 'Failed to generate synthetic data',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const exportData = () => {
    if (!results) return;

    let content = '';
    let filename = `${datasetName}_${Date.now()}`;

    if (dataFormat === 'json') {
      content = JSON.stringify(results.records, null, 2);
      filename += '.json';
    } else {
      const headers = schemas.map((s) => s.fieldName).join(',');
      const rows = results.records.map((record) =>
        schemas.map((s) => `"${record[s.fieldName] || ''}"`.replace(/"/g, '""')).join(',')
      );
      content = [headers, ...rows].join('\n');
      filename += '.csv';
    }

    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const copyToClipboard = () => {
    if (!results) return;
    const json = JSON.stringify(results.records, null, 2);
    navigator.clipboard.writeText(json);
  };

  return (
    <div className="flex flex-col gap-6 p-6 h-full overflow-auto bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
          <Database className="w-8 h-8 text-blue-400" />
          Synthetic Dataset Generator
        </h2>
        <p className="text-slate-400">Create realistic test data from schema specifications</p>
      </div>

      {/* Configuration Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-800/50 border border-slate-700 rounded-lg p-4">
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Dataset Name</label>
          <input
            type="text"
            value={datasetName}
            onChange={(e) => setDatasetName(e.target.value)}
            className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded text-white placeholder-slate-500 focus:outline-none focus:border-blue-400"
            placeholder="Enter dataset name"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">
            Record Count: {recordCount}
          </label>
          <input
            type="range"
            min="10"
            max="10000"
            value={recordCount}
            onChange={(e) => setRecordCount(parseInt(e.target.value))}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Export Format</label>
          <select
            value={dataFormat}
            onChange={(e) => setDataFormat(e.target.value as 'json' | 'csv')}
            className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded text-white focus:outline-none focus:border-blue-400"
          >
            <option value="json">JSON</option>
            <option value="csv">CSV</option>
          </select>
        </div>

        <div className="flex items-end">
          <button
            onClick={generateData}
            disabled={isGenerating}
            className="w-full py-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 disabled:from-slate-600 disabled:to-slate-700 text-white rounded font-semibold flex items-center justify-center gap-2 transition-all"
          >
            <Play className="w-4 h-4" />
            {isGenerating ? 'Generating...' : 'Generate Data'}
          </button>
        </div>
      </div>

      {/* Schema Editor */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-slate-400" />
            Data Schema
          </h3>
          <button
            onClick={addSchema}
            className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded text-sm font-semibold"
          >
            + Add Field
          </button>
        </div>

        <div className="space-y-3">
          {schemas.map((schema, index) => (
            <div key={index} className="flex gap-2 items-end">
              <input
                type="text"
                value={schema.fieldName}
                onChange={(e) => updateSchema(index, 'fieldName', e.target.value)}
                placeholder="Field name"
                className="flex-1 px-3 py-2 bg-slate-700/50 border border-slate-600 rounded text-white text-sm focus:outline-none focus:border-cyan-400"
              />
              <select
                value={schema.dataType}
                onChange={(e) => updateSchema(index, 'dataType', e.target.value)}
                className="px-3 py-2 bg-slate-700/50 border border-slate-600 rounded text-white text-sm focus:outline-none focus:border-cyan-400"
              >
                <option value="string">String</option>
                <option value="number">Number</option>
                <option value="boolean">Boolean</option>
                <option value="date">Date</option>
                <option value="email">Email</option>
                <option value="json">JSON</option>
              </select>
              <input
                type="text"
                value={schema.description}
                onChange={(e) => updateSchema(index, 'description', e.target.value)}
                placeholder="Description"
                className="flex-1 px-3 py-2 bg-slate-700/50 border border-slate-600 rounded text-white text-sm focus:outline-none focus:border-cyan-400"
              />
              {schemas.length > 1 && (
                <button
                  onClick={() => removeSchema(index)}
                  className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded text-sm font-semibold"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Results Panel */}
      {results && (
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              {results.status === 'success' ? (
                <Zap className="w-5 h-5 text-green-400" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-400" />
              )}
              {results.status === 'success'
                ? `Generated ${results.recordCount} Records`
                : 'Generation Failed'}
            </h3>
            <div className="flex gap-2">
              {results.status === 'success' && (
                <>
                  <button
                    onClick={copyToClipboard}
                    className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded text-sm flex items-center gap-1"
                  >
                    <Copy className="w-4 h-4" /> Copy
                  </button>
                  <button
                    onClick={exportData}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-sm flex items-center gap-1"
                  >
                    <Download className="w-4 h-4" /> Export
                  </button>
                </>
              )}
            </div>
          </div>

          {results.status === 'success' && (
            <div className="bg-slate-900/50 rounded p-3 max-h-64 overflow-auto font-mono text-sm text-slate-300">
              <pre>{JSON.stringify(results.records.slice(0, 5), null, 2)}</pre>
              {results.records.length > 5 && (
                <p className="text-slate-500 mt-2">... and {results.records.length - 5} more records</p>
              )}
            </div>
          )}

          {results.status === 'error' && (
            <div className="bg-red-500/10 border border-red-500/30 rounded p-3 text-red-400">
              {results.error}
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!results && (
        <div className="flex flex-col items-center justify-center py-12 text-slate-400 bg-slate-800/30 rounded-lg border border-slate-700 border-dashed">
          <Database className="w-16 h-16 mb-3 opacity-50" />
          <p className="text-lg font-semibold">No data generated yet</p>
          <p className="text-sm">Configure your schema and click Generate Data to create synthetic records</p>
        </div>
      )}
    </div>
  );
}
