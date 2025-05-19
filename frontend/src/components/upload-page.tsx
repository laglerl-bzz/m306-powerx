import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";

const UploadPage = () => {
    return (
        <div className="container mx-auto py-10">
            <Card className="max-w-md mx-auto">
                <CardHeader>
                    <CardTitle className="text-xl font-bold">Upload Power Data</CardTitle>
                    <CardDescription>
                        Upload your power consumption data file for analysis
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="space-y-6">
                        <div className="grid w-full gap-1.5">
                            <Label htmlFor="file">Select File</Label>
                            <div className="mt-2">
                                <input
                                    id="file"
                                    type="file"
                                    className="block w-full text-sm text-slate-500
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-md file:border-0
                                    file:text-sm file:font-medium
                                    file:bg-primary file:text-primary-foreground
                                    hover:file:bg-primary/90
                                    cursor-pointer"
                                />
                            </div>
                        </div>
                        <Button type="submit" className="w-full">
                            <Upload className="mr-2 h-4 w-4" /> Upload File
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default UploadPage;