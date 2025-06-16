import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, File } from "lucide-react";
import { useState, useRef } from "react";

const UploadPage = () => {
    const [isDragging, setIsDragging] = useState(false);
    const [fileName, setFileName] = useState<string | null>(null);
    const [fileType, setFileType] = useState<'sdat' | 'esl'>('sdat');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const file = e.dataTransfer.files[0];
            setFileName(file.name);
            // Handle file upload logic here
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFileName(e.target.files[0].name);
            // Handle file upload logic here
        }
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="container mx-auto py-10">
            <Card className="max-w-7xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-xl font-bold">Stromdaten hochladen</CardTitle>
                    <CardDescription>
                        Lade deine Datei mit Stromverbrauchsdaten zur Analyse hoch
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        {/* Dateityp-Tabs */}
                        <div className="space-y-2">
                            <Label className="text-base">Dateityp</Label>
                            <div className="text-sm text-muted-foreground mb-3">
                                Wähle den Typ der Stromdaten-Datei, die du hochladen möchtest
                            </div>
                            <div className="flex w-full rounded-lg border bg-muted p-1">
                                <button
                                    type="button"
                                    onClick={() => setFileType('sdat')}
                                    className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-all ${
                                        fileType === 'sdat'
                                            ? 'bg-background text-foreground shadow-sm'
                                            : 'text-muted-foreground hover:text-foreground'
                                    }`}
                                >
                                    SDAT-Dateien
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFileType('esl')}
                                    className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-all ${
                                        fileType === 'esl'
                                            ? 'bg-background text-foreground shadow-sm'
                                            : 'text-muted-foreground hover:text-foreground'
                                    }`}
                                >
                                    ESL-Dateien
                                </button>
                            </div>
                        </div>

                        <div className="grid w-full gap-1.5">
                            <Label htmlFor="file">Datei auswählen oder hierher ziehen</Label>
                            <div
                                className={`mt-2 border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors
                                    ${isDragging 
                                        ? 'border-primary bg-primary/10' 
                                        : 'border-gray-300 hover:border-primary hover:bg-gray-50 dark:hover:bg-gray-800'
                                    }`}
                                onDragEnter={handleDragEnter}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                onClick={handleClick}
                            >
                                <input
                                    ref={fileInputRef}
                                    id="file"
                                    type="file"
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                                <div className="flex flex-col items-center justify-center space-y-4">
                                    <div className="rounded-full bg-primary/10 p-3">
                                        <Upload className="h-6 w-6 text-primary" />
                                    </div>
                                    {fileName ? (
                                        <div className="flex items-center space-x-2">
                                            <File className="h-5 w-5" />
                                            <span className="text-sm font-medium">{fileName}</span>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="space-y-1 text-center">
                                                <p className="text-sm font-medium">
                                                    <span className="text-primary font-semibold">Zum Hochladen klicken</span> oder Datei hierher ziehen
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {fileType.toUpperCase()}-Dateien (XML, max. 10MB)
                                                </p>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                        
                        {fileName && (
                            <Button type="button" className="w-full">
                                <Upload className="mr-2 h-4 w-4" /> Datei verarbeiten
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default UploadPage;