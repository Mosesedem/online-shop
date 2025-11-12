"use client";

import { useState } from "react";
import { CldUploadWidget } from "next-cloudinary";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Link as LinkIcon, X } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  maxImages?: number;
  label?: string;
}

export function ImageUpload({ value = [], onChange, maxImages = 5, label = "Images" }: ImageUploadProps) {
  const [urlInput, setUrlInput] = useState("");

  const handleUploadSuccess = (result: any) => {
    const newUrl = result.info.secure_url;
    if (value.length < maxImages) {
      onChange([...value, newUrl]);
    }
  };

  const handleAddUrl = () => {
    if (urlInput && value.length < maxImages) {
      onChange([...value, urlInput]);
      setUrlInput("");
    }
  };

  const handleRemove = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <Label>{label}</Label>

      <Tabs defaultValue="url" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="url">
            <LinkIcon className="w-4 h-4 mr-2" />
            URL
          </TabsTrigger>
          <TabsTrigger value="upload">
            <Upload className="w-4 h-4 mr-2" />
            Upload
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-4">
          {!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || !process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ? (
            <div className="p-4 border border-yellow-500 bg-yellow-50 rounded-md">
              <p className="text-sm text-yellow-800 font-medium mb-2">
                ⚠️ Cloudinary Not Configured
              </p>
              <p className="text-xs text-yellow-700 mb-2">
                To enable image uploads, add these to your <code className="bg-yellow-100 px-1 rounded">.env.local</code>:
              </p>
              <pre className="text-xs bg-yellow-100 p-2 rounded overflow-x-auto">
{`NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_preset_name`}
              </pre>
              <p className="text-xs text-yellow-700 mt-2">
                See <code className="bg-yellow-100 px-1 rounded">CLOUDINARY_SETUP.md</code> for instructions.
              </p>
            </div>
          ) : (
            <>
              <CldUploadWidget
                uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                onSuccess={handleUploadSuccess}
                onError={(error) => {
                  console.error("Upload error:", error);
                  alert("Upload failed. Please check your Cloudinary configuration.");
                }}
                options={{
                  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
                  maxFiles: 1,
                  resourceType: "image",
                  clientAllowedFormats: ["jpg", "jpeg", "png", "gif", "webp"],
                  maxFileSize: 10000000, // 10MB
                  sources: ["local", "url", "camera"],
                }}
              >
                {({ open }) => (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      if (typeof open === 'function') {
                        try {
                          open();
                        } catch (error) {
                          console.error("Failed to open upload widget:", error);
                          alert("Upload widget failed to open. Please use the URL tab instead or check your Cloudinary configuration.");
                        }
                      } else {
                        console.error("Upload widget not initialized. Open function is:", typeof open);
                        alert("Upload widget is not available. Please use the URL tab to add images, or check that Cloudinary is properly configured.");
                      }
                    }}
                    disabled={value.length >= maxImages}
                    className="w-full"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Image {value.length > 0 && `(${value.length}/${maxImages})`}
                  </Button>
                )}
              </CldUploadWidget>
              <p className="text-xs text-muted-foreground">
                Click to upload images from your device. Max {maxImages} images.
              </p>
            </>
          )}
        </TabsContent>

        <TabsContent value="url" className="space-y-4">
          <div className="space-y-3">
            <div className="flex gap-2">
              <Input
                placeholder="https://example.com/image.jpg"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddUrl();
                  }
                }}
              />
              <Button
                type="button"
                onClick={handleAddUrl}
                disabled={!urlInput || value.length >= maxImages}
              >
                Add
              </Button>
            </div>
            <div className="text-xs space-y-1">
              <p className="text-muted-foreground">
                ✓ Paste image URL and press Enter or click Add. Max {maxImages} images.
              </p>
              <p className="text-muted-foreground">
                💡 <strong>Tip:</strong> Upload to <a href="https://imgur.com/upload" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Imgur</a> or any image host, then paste the URL here.
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Image Preview Grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-4">
          {value.map((url, index) => (
            <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border">
              <Image
                src={url}
                alt={`Image ${index + 1}`}
                fill
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
              {index === 0 && (
                <div className="absolute bottom-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                  Main
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
