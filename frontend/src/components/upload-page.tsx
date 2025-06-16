// src/components/upload-page.tsx

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, File as FileIcon } from "lucide-react";
import { useState, useRef } from "react";
import { uploadFiles, type FileType, type SdatResult, type EslResult, type UploadResponse } from "@/services/api";

export default function UploadPage() {
  const [isDragging, setIsDragging] = useState(false);
  const [fileType, setFileType] = useState<FileType>("sdat");
  const [files, setFiles] = useState<File[]>([]);
  const [result, setResult] = useState<UploadResponse<SdatResult> | UploadResponse<EslResult> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const dropped = Array.from(e.dataTransfer.files);
    setFiles((prev) => [...prev, ...dropped]);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputFiles = e.target.files;
    if (!inputFiles) return;
    setFiles((prev) => [...prev, ...Array.from(inputFiles)]);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    try {
      const data = await uploadFiles(fileType, files);
      setResult(data);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const clearAll = () => {
    setFiles([]);
    setResult(null);
  };

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-3xl mx-auto space-y-6">
        <CardHeader>
          <CardTitle>Upload Power Data</CardTitle>
          <CardDescription>Choose file type and upload one or more XML files</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* File Type Selector */}
          <div>
            <Label className="text-base">File Type</Label>
            <div className="flex w-full rounded-lg border bg-muted p-1 mt-2">
              {(["sdat", "esl"] as FileType[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFileType(type)}
                  className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-all ${
                    fileType === type
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {type.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Dropzone */}
          <div>
            <Label htmlFor="file-input">Select or Drag & Drop Files</Label>
            <div
              id="file-input"
              className={`mt-2 border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors ${
                isDragging
                  ? "border-primary bg-primary/10"
                  : "border-gray-300 hover:border-primary hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
              onDragEnter={onDragEnter}
              onDragLeave={onDragLeave}
              onDragOver={onDragOver}
              onDrop={onDrop}
              onClick={handleClick}
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                multiple
                accept=".xml"
                onChange={onFileChange}
              />
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="rounded-full bg-primary/10 p-3">
                  <Upload className="h-6 w-6 text-primary" />
                </div>
                <div className="space-y-1 text-center">
                  <p className="text-sm font-medium">
                    <span className="text-primary font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {fileType.toUpperCase()} files (XML, max. 10MB each)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Selected Files List */}
          {files.length > 0 && (
            <div className="space-y-2">
              <Label>Selected Files:</Label>
              <ul className="list-disc list-inside text-sm">
                {files.map((f, idx) => (
                  <li key={`${f.name}-${idx}`} className="flex items-center space-x-2">
                    <FileIcon className="h-4 w-4" />
                    <span>{f.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <Button onClick={handleUpload} disabled={files.length === 0} className="flex-1">
              <Upload className="mr-2 h-4 w-4" /> Process Files
            </Button>
            <Button
              variant="outline"
              onClick={clearAll}
              disabled={files.length === 0}
              className="flex-1"
            >
              Clear
            </Button>
          </div>

          {/* Result */}
          {result && (
            <pre className="mt-4 bg-gray-100 p-4 rounded text-xs overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
