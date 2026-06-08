"use client";

import { useState, useRef } from "react";
import { Plus, Trash2, Image as ImageIcon, Upload, X, Loader2, ExternalLink, Copy, Check, Folder, ChevronRight, ArrowLeft, FolderPlus, Download } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
    getGalleryImages, 
    uploadGalleryImage, 
    deleteGalleryImage, 
    bulkDeleteGalleryImages,
    getFolders, 
    createFolder, 
    deleteFolder,
    exportGallery,
    GalleryItem,
    GalleryFolder
} from "@/services/galleryApi";
import toast from "react-hot-toast";
import Button from "@/components/Button";
import Loader from "@/components/Loader";
import { cn } from "@/utils/cn";

export default function GalleryPage() {
    const queryClient = useQueryClient();
    const [selectedFolder, setSelectedFolder] = useState<GalleryFolder | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [previewImages, setPreviewImages] = useState<string[]>([]);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [isCreatingFolder, setIsCreatingFolder] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [newFolderName, setNewFolderName] = useState("");
    const [selectedImageIds, setSelectedImageIds] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Fetch Folders
    const { data: folderData, isLoading: isLoadingFolders } = useQuery({
        queryKey: ["folders"],
        queryFn: getFolders,
    });

    // Fetch Gallery Images for selected folder
    const { data: imageData, isLoading: isLoadingImages } = useQuery({
        queryKey: ["gallery", selectedFolder?._id],
        queryFn: () => getGalleryImages(selectedFolder?._id),
        enabled: !!selectedFolder,
    });

    const folders = folderData?.folders || [];
    const images = imageData?.images || [];

    // Folder Mutations
    const createFolderMutation = useMutation({
        mutationFn: createFolder,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["folders"] });
            toast.success("Folder created successfully");
            setIsCreatingFolder(false);
            setNewFolderName("");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to create folder");
        }
    });

    const deleteFolderMutation = useMutation({
        mutationFn: deleteFolder,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["folders"] });
            toast.success("Folder deleted");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to delete folder. Make sure it's empty.");
        }
    });

    // Image Mutations
    const uploadMutation = useMutation({
        mutationFn: uploadGalleryImage,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["gallery", selectedFolder?._id] });
            toast.success("Assets uploaded to folder");
            handleCancelUpload();
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Upload failed");
            setIsUploading(false);
        }
    });

    const deleteMutation = useMutation({
        mutationFn: deleteGalleryImage,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["gallery", selectedFolder?._id] });
            toast.success("Image removed");
            setSelectedImageIds(prev => prev.filter(id => id !== selectedImageIds[0])); // Cleanup if single delete
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Delete failed");
        }
    });

    const bulkDeleteMutation = useMutation({
        mutationFn: bulkDeleteGalleryImages,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["gallery", selectedFolder?._id] });
            toast.success("Selected images deleted");
            setSelectedImageIds([]);
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Bulk delete failed");
        }
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        if (files.length > 50) {
            toast.error("You can only upload up to 50 images at once.");
            return;
        }

        setSelectedFiles(files);
        const newPreviews: string[] = [];
        
        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                newPreviews.push(reader.result as string);
                if (newPreviews.length === files.length) {
                    setPreviewImages(newPreviews);
                }
            };
            reader.readAsDataURL(file);
        });
    };

    const handleUpload = () => {
        if (selectedFiles.length === 0 || !selectedFolder) return;

        setIsUploading(true);
        const formData = new FormData();
        selectedFiles.forEach(file => {
            formData.append("images", file);
        });
        formData.append("folderId", selectedFolder._id);
        uploadMutation.mutate(formData);
    };

    const handleCancelUpload = () => {
        setSelectedFiles([]);
        setPreviewImages([]);
        setIsUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleDelete = (id: string) => {
        if (window.confirm("Are you sure you want to remove this image?")) {
            deleteMutation.mutate(id);
        }
    };

    const handleBulkDelete = () => {
        if (window.confirm(`Are you sure you want to delete ${selectedImageIds.length} images?`)) {
            bulkDeleteMutation.mutate(selectedImageIds);
        }
    };

    const toggleImageSelection = (id: string) => {
        setSelectedImageIds(prev => 
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        toast.success("URL copied");
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleCreateFolder = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newFolderName.trim()) return;
        createFolderMutation.mutate(newFolderName);
    };

    const handleExport = async () => {
        try {
            setIsExporting(true);
            const blob = await exportGallery();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `gsons_gallery_backup_${new Date().toISOString().split('T')[0]}.zip`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            toast.success("Gallery export successful");
        } catch (error) {
            toast.error("Failed to export gallery");
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="space-y-8 pb-20">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <h1 
                            className={cn(
                                "text-3xl font-semibold text-gray-900  cursor-pointer hover:text-primary transition-colors",
                                selectedFolder && "text-gray-400 text-xl font-semibold"
                            )}
                            onClick={() => setSelectedFolder(null)}
                        >
                            Image Gallery
                        </h1>
                        {selectedFolder && (
                            <>
                                <ChevronRight className="w-5 h-5 text-gray-300" />
                                <h1 className="text-3xl font-semibold text-gray-900 ">{selectedFolder.name}</h1>
                            </>
                        )}
                    </div>
                    <p className="text-gray-500 font-medium">
                        {selectedFolder 
                            ? `Manage images inside ${selectedFolder.name}` 
                            : "Organize and manage your architectural assets in folders."}
                    </p>
                </div>
                
                <div className="flex items-center gap-4">
                    {!selectedFolder ? (
                        <div className="flex items-center gap-3">
                            <Button
                                variant="primary"
                                onClick={() => setIsCreatingFolder(true)}
                                leftIcon={<FolderPlus className="w-5 h-5" />}
                                className="shadow-lg shadow-primary/20"
                            >
                                New Folder
                            </Button>
                            <Button
                                variant="outline"
                                onClick={handleExport}
                                disabled={isExporting}
                                leftIcon={isExporting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
                            >
                                {isExporting ? "Zipping..." : "Export All"}
                            </Button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                multiple
                                onChange={handleFileChange}
                            />
                            {selectedImageIds.length > 0 && (
                                <Button
                                    variant="outline"
                                    onClick={handleBulkDelete}
                                    leftIcon={<Trash2 className="w-4 h-4" />}
                                    className="text-red-500 border-red-100 hover:bg-red-50"
                                >
                                    Delete ({selectedImageIds.length})
                                </Button>
                            )}
                            {previewImages.length === 0 ? (
                                <Button
                                    variant="primary"
                                    onClick={() => fileInputRef.current?.click()}
                                    leftIcon={<Plus className="w-5 h-5" />}
                                    className="shadow-lg shadow-primary/20"
                                >
                                    Upload Assets
                                </Button>
                            ) : (
                                <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-4 duration-300">
                                     <Button
                                        variant="outline"
                                        onClick={handleCancelUpload}
                                        disabled={isUploading}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="primary"
                                        onClick={handleUpload}
                                        disabled={isUploading}
                                        leftIcon={isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                                    >
                                        {isUploading ? "Uploading..." : `Confirm ${selectedFiles.length}`}
                                    </Button>
                                </div>
                            )}
                            <Button
                                variant="outline"
                                onClick={() => setSelectedFolder(null)}
                                leftIcon={<ArrowLeft className="w-4 h-4" />}
                            >
                                Back
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {/* Create Folder Modal */}
            {isCreatingFolder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl animate-in zoom-in-95 duration-300">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-semibold text-gray-900">Create New Folder</h3>
                            <button onClick={() => setIsCreatingFolder(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <X className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>
                        <form onSubmit={handleCreateFolder} className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Folder Name</label>
                                <input
                                    type="text"
                                    value={newFolderName}
                                    onChange={(e) => setNewFolderName(e.target.value)}
                                    placeholder="e.g., Exterior Designs, Layouts..."
                                    className="w-full px-4 py-3 text-gray-400 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                    autoFocus
                                />
                            </div>
                            <div className="flex gap-3">
                                <Button
                                    variant="outline"
                                    onClick={() => setIsCreatingFolder(false)}
                                    className="flex-1"
                                    type="button"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="primary"
                                    className="flex-1"
                                    type="submit"
                                    disabled={!newFolderName.trim() || createFolderMutation.isPending}
                                >
                                    {createFolderMutation.isPending ? "Creating..." : "Create Folder"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Upload Preview Widget */}
            {previewImages.length > 0 && (
                <div className="bg-white p-6 rounded-3xl border-2 border-dashed border-primary/20 animate-in zoom-in-95 duration-300 shadow-xl shadow-primary/5">
                    <div className="flex flex-col gap-6">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                <ImageIcon className="w-5 h-5 text-primary" />
                                Batch Preview ({selectedFiles.length} images)
                            </h3>
                            <p className="text-xs text-gray-400 font-medium italic">Uploading to {selectedFolder?.name}</p>
                        </div>
                        
                        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3 max-h-[300px] overflow-y-auto p-1">
                            {previewImages.map((src, idx) => (
                                <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-gray-100 shadow-sm">
                                    <img src={src} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                                    {isUploading && (
                                        <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
                                            <Loader2 className="w-4 h-4 text-primary animate-spin" />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content Area */}
            <div className="bg-white rounded-4xl border border-stone-100 shadow-sm p-8 min-h-[400px]">
                {!selectedFolder ? (
                    // Folder List View
                    isLoadingFolders ? (
                        <div className="py-20 flex justify-center">
                            <Loader text="Loading Folders..." />
                        </div>
                    ) : folders.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                            {folders.map((folder) => (
                                <div 
                                    key={folder._id}
                                    className="group relative bg-stone-50 rounded-3xl p-6 border border-transparent hover:border-primary/20 hover:bg-white hover:shadow-xl transition-all duration-300 cursor-pointer"
                                    onClick={() => setSelectedFolder(folder)}
                                >
                                    <div className="flex flex-col items-center text-center space-y-4">
                                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:bg-primary/5 transition-colors">
                                            <Folder className="w-8 h-8 text-primary/40 group-hover:text-primary transition-colors" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">{folder.name}</h3>
                                            <p className="text-xs text-gray-400 mt-1  font-semibold ">
                                                {new Date(folder.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    {/* Action Button (Delete) */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (window.confirm("Delete this folder? (Only works if folder is empty)")) {
                                                deleteFolderMutation.mutate(folder._id);
                                            }
                                        }}
                                        className="absolute top-4 right-4 p-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50 rounded-full"
                                        title="Delete Folder"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-20 text-center flex flex-col items-center justify-center space-y-6">
                            <div className="w-24 h-24 bg-stone-50 rounded-3xl flex items-center justify-center">
                                <Folder className="w-10 h-10 text-stone-200" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-semibold text-gray-900">Archive is empty</h3>
                                <p className="text-gray-400 max-w-xs mx-auto">Create your first folder to start organizing architectural assets.</p>
                            </div>
                            <Button
                                variant="primary"
                                onClick={() => setIsCreatingFolder(true)}
                                leftIcon={<Plus className="w-4 h-4" />}
                            >
                                Create First Folder
                            </Button>
                        </div>
                    )
                ) : (
                    // Image List View (Inside Folder)
                    isLoadingImages ? (
                        <div className="py-20 flex justify-center">
                            <Loader text="Accessing assets..." />
                        </div>
                    ) : images.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                            {images.map((item: GalleryItem) => {
                                const isSelected = selectedImageIds.includes(item._id);
                                return (
                                    <div 
                                        key={item._id} 
                                        className={cn(
                                            "group relative bg-stone-50 rounded-2xl overflow-hidden border transition-all duration-500",
                                            isSelected ? "border-primary shadow-lg ring-2 ring-primary/10" : "border-transparent hover:border-primary/20 hover:shadow-xl hover:-translate-y-1"
                                        )}
                                    >
                                        <div 
                                            className="aspect-square relative flex items-center justify-center bg-white p-2 cursor-pointer"
                                            onClick={() => toggleImageSelection(item._id)}
                                        >
                                            <img
                                                src={item.url}
                                                alt="Gallery"
                                                className={cn(
                                                    "max-w-full max-h-full object-contain transition-transform duration-700",
                                                    isSelected ? "scale-95" : "group-hover:scale-105"
                                                )}
                                            />
                                            
                                            {/* Checkbox overlay */}
                                            <div className={cn(
                                                "absolute top-3 left-3 w-6 h-6 rounded-lg flex items-center justify-center transition-all duration-300 border-2",
                                                isSelected 
                                                    ? "bg-primary border-primary text-white scale-100" 
                                                    : "bg-white/80 border-gray-200 opacity-0 group-hover:opacity-100 scale-90"
                                            )}>
                                                {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                                            </div>

                                            {/* Action Overlays */}
                                            {!isSelected && (
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-[2px] flex flex-col items-center justify-center gap-3">
                                                    <div className="flex items-center gap-2">
                                                        <a 
                                                            href={item.url} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer"
                                                            className="w-10 h-10 rounded-full bg-white text-gray-900 flex items-center justify-center hover:bg-primary hover:text-white transition-all transform hover:scale-110 shadow-lg"
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            <ExternalLink className="w-4 h-4" />
                                                        </a>
                                                        <button 
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                copyToClipboard(item.url, item._id);
                                                            }}
                                                            className="w-10 h-10 rounded-full bg-white text-gray-900 flex items-center justify-center hover:bg-primary hover:text-white transition-all transform hover:scale-110 shadow-lg"
                                                        >
                                                            {copiedId === item._id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                                        </button>
                                                        <button 
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDelete(item._id);
                                                            }}
                                                            className="w-10 h-10 rounded-full bg-white text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all transform hover:scale-110 shadow-lg"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-3 border-t border-stone-100 bg-white flex items-center justify-between">
                                            <span className="text-[10px] font-mono font-semibold text-stone-400 truncate max-w-[100px]">
                                                {item.public_id.split('/').pop()}
                                            </span>
                                            <span className="text-[9px] font-semibold text-stone-300  ">
                                                {new Date(item.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="py-24 text-center flex flex-col items-center justify-center space-y-6">
                            <div className="w-24 h-24 bg-stone-50 rounded-3xl flex items-center justify-center">
                                <ImageIcon className="w-10 h-10 text-stone-200" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-semibold text-gray-900">Folder is empty</h3>
                                <p className="text-gray-400 max-w-xs mx-auto">Upload assets into this category to organize your library.</p>
                            </div>
                            <Button
                                variant="primary"
                                onClick={() => fileInputRef.current?.click()}
                                leftIcon={<Upload className="w-4 h-4" />}
                            >
                                Upload Assets
                            </Button>
                        </div>
                    )
                )}
            </div>
        </div>
    );
}
