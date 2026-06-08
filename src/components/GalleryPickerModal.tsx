"use client";

import { useState, useEffect } from "react";
import { X, Search, Check, Image as ImageIcon, Loader2, Folder, ChevronRight, ArrowLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getGalleryImages, getFolders, GalleryItem, GalleryFolder } from "@/services/galleryApi";
import Button from "./Button";
import { cn } from "@/utils/cn";

interface GalleryPickerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (selectedImages: GalleryItem[]) => void;
}

export default function GalleryPickerModal({ isOpen, onClose, onSelect }: GalleryPickerModalProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [selectedFolder, setSelectedFolder] = useState<GalleryFolder | null>(null);

    // Fetch Folders
    const { data: folderData, isLoading: isLoadingFolders } = useQuery({
        queryKey: ["folders"],
        queryFn: getFolders,
        enabled: isOpen,
    });

    // Fetch Images for selected folder
    const { data: imageData, isLoading: isLoadingImages } = useQuery({
        queryKey: ["gallery", selectedFolder?._id],
        queryFn: () => getGalleryImages(selectedFolder?._id),
        enabled: isOpen && !!selectedFolder,
    });

    const folders = folderData?.folders || [];
    const images = imageData?.images || [];

    // Reset view when modal closes
    useEffect(() => {
        if (!isOpen) {
            setSelectedFolder(null);
            setSearchTerm("");
        }
    }, [isOpen]);

    const filteredFolders = folders.filter(f => 
        f.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const filteredImages = images.filter(img => 
        img.public_id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleSelect = (item: GalleryItem) => {
        const id = item._id;
        setSelectedIds(prev => 
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleConfirm = () => {
        // Since we only have images for the current folder in 'images' variable,
        // we might have selected images from different folders.
        // HOWEVER, the current implementation of GalleryPickerModal usually assumes we select from what's visible.
        // If we want to support cross-folder selection, we need a way to track the actual objects.
        // For now, let's assume selection is per folder or we just pass IDs.
        // Actually, let's fetch all selected images if needed, or just use a trick.
        
        // BETTER: OnSelect expects GalleryItem[]. We need to make sure we have them.
        // Let's modify toggleSelect to store the whole item or use a map.
        onSelect(allSelectedImages);
        setSelectedIds([]);
        onClose();
    };

    // To support cross-folder selection, we need to track the actual items
    const [selectedItems, setSelectedItems] = useState<Map<string, GalleryItem>>(new Map());

    const handleToggleSelect = (item: GalleryItem) => {
        setSelectedItems(prev => {
            const next = new Map(prev);
            if (next.has(item._id)) {
                next.delete(item._id);
            } else {
                next.set(item._id, item);
            }
            return next;
        });
    };

    const allSelectedImages = Array.from(selectedItems.values());

    if (!isOpen) return null;

    const isLoading = selectedFolder ? isLoadingImages : isLoadingFolders;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-5xl h-[120vh] rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
                    <div className="flex items-center gap-2">
                        <div 
                            className={cn(
                                "cursor-pointer hover:text-primary transition-colors",
                                selectedFolder ? "text-gray-400" : "text-gray-900"
                            )}
                            onClick={() => setSelectedFolder(null)}
                        >
                            <h2 className="text-2xl font-semibold leading-tight">Select from Gallery</h2>
                        </div>
                        {selectedFolder && (
                            <>
                                <ChevronRight className="w-5 h-5 text-gray-300" />
                                <h2 className="text-2xl font-semibold text-gray-900 leading-tight">{selectedFolder.name}</h2>
                            </>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2.5 hover:bg-gray-100 rounded-full transition-all hover:rotate-90 duration-300"
                    >
                        <X className="w-6 h-6 text-gray-400" />
                    </button>
                </div>

                {/* Search & Navigation Bar */}
                <div className="px-8 py-4 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder={selectedFolder ? "Search in this folder..." : "Search folders..."}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm shadow-sm"
                        />
                    </div>
                    {selectedFolder && (
                        <Button
                            variant="outline"
                            onClick={() => setSelectedFolder(null)}
                            leftIcon={<ArrowLeft className="w-4 h-4" />}
                            className="bg-white border-gray-200"
                        >
                            Back to Folders
                        </Button>
                    )}
                </div>

                {/* Grid Content */}
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    {isLoading ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
                            <Loader2 className="w-10 h-10 animate-spin text-primary" />
                            <p className="text-sm font-medium ">Syncing with Archive...</p>
                        </div>
                    ) : !selectedFolder ? (
                        // Folder Selection
                        filteredFolders.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                                {filteredFolders.map((folder) => (
                                    <div
                                        key={folder._id}
                                        onClick={() => {
                                            setSelectedFolder(folder);
                                            setSearchTerm("");
                                        }}
                                        className="group relative bg-stone-50 rounded-3xl p-6 border border-transparent hover:border-primary/20 hover:bg-white hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col items-center text-center space-y-4"
                                    >
                                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:bg-primary/5 transition-colors">
                                            <Folder className="w-8 h-8 text-primary/40 group-hover:text-primary transition-colors" />
                                        </div>
                                        <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors text-sm">{folder.name}</h3>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
                                <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mb-2">
                                    <Folder className="w-10 h-10 text-gray-200" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900">No folders found</h3>
                                <p className="text-sm max-w-xs text-center">Try a different search term or check the admin gallery.</p>
                            </div>
                        )
                    ) : (
                        // Image Selection
                        filteredImages.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                                {filteredImages.map((image) => {
                                    const isSelected = selectedItems.has(image._id);
                                    const isVideo = image.url.match(/\.(mp4|webm|ogg)$/i);
                                    return (
                                        <div
                                            key={image._id}
                                            onClick={() => handleToggleSelect(image)}
                                            className={cn(
                                                "relative aspect-square rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 group border-2",
                                                isSelected 
                                                    ? "border-primary ring-4 ring-primary/10 shadow-lg" 
                                                    : "border-transparent hover:border-gray-200"
                                            )}
                                        >
                                            {isVideo ? (
                                                <video
                                                    src={image.url}
                                                    autoPlay
                                                    loop
                                                    muted
                                                    playsInline
                                                    className={cn(
                                                        "w-full h-full object-cover transition-transform duration-500",
                                                        isSelected ? "scale-105" : "group-hover:scale-110"
                                                    )}
                                                />
                                            ) : (
                                                <img
                                                    src={image.url}
                                                    alt="Gallery"
                                                    className={cn(
                                                        "w-full h-full object-cover transition-transform duration-500",
                                                        isSelected ? "scale-105" : "group-hover:scale-110"
                                                    )}
                                                />
                                            )}
                                            
                                            {/* Selection Indicator */}
                                            <div className={cn(
                                                "absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 border-2",
                                                isSelected 
                                                    ? "bg-primary border-primary text-white scale-100 shadow-md" 
                                                    : "bg-white/80 border-gray-200 opacity-0 group-hover:opacity-100 scale-90"
                                            )}>
                                                <Check className="w-4 h-4 stroke-[3]" />
                                            </div>

                                            {/* Overlay on hover/select */}
                                            <div className={cn(
                                                "absolute inset-0 transition-all duration-300 pointer-events-none",
                                                isSelected ? "bg-primary/5" : "group-hover:bg-black/5"
                                            )} />
                                            
                                            <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity">
                                                <p className="text-[10px] text-white font-mono truncate">{image.public_id.split('/').pop()}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
                                <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mb-2">
                                    <ImageIcon className="w-10 h-10 text-gray-200" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900">Folder is empty</h3>
                                <p className="text-sm max-w-xs text-center">This folder doesn't contain any images yet.</p>
                            </div>
                        )
                    )}
                </div>

                {/* Footer Actions */}
                <div className="px-8 py-6 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between sticky bottom-0 z-10">
                    <p className="text-sm font-semibold text-gray-500 bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm flex items-center gap-2">
                        <Check className="w-4 h-4 text-primary" />
                        {allSelectedImages.length} assets selected
                    </p>
                    <div className="flex items-center gap-3">
                        <Button 
                            variant="outline" 
                            onClick={onClose}
                            className="bg-white border-gray-200"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleConfirm}
                            disabled={allSelectedImages.length === 0}
                            className="px-8 shadow-lg shadow-primary/20"
                        >
                            Attach {allSelectedImages.length > 0 ? `(${allSelectedImages.length})` : ""}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
