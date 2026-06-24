import React, { useState } from 'react'
import { Separator } from "@/components/ui/separator"
import { IoClose, IoStar } from 'react-icons/io5'
import { useUser } from '@clerk/nextjs'

function ImagesUpload({ setImages, defaultImages = [] }) {
    const [selectedFileList, setSelectedFileList] = useState(defaultImages);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const { isSignedIn } = useUser();
    const isDark = isSignedIn;

    React.useEffect(() => {
        if (defaultImages && defaultImages.length > 0) {
            setSelectedFileList(defaultImages);
        }
    }, [defaultImages]);

    const dropJustOccurredRef = React.useRef(false);

    const uploadFiles = async (files) => {
        if (!files || files.length === 0) return;

        console.log("DriveNest Upload: Starting upload of files:", files);
        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
        const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

        if (!cloudName || !uploadPreset) {
            console.error("DriveNest Upload Error: Missing Cloudinary configuration.");
            alert("Missing Cloudinary configuration. Please add NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET to your .env.local file.");
            return;
        }

        setUploading(true);
        setUploadProgress(0);

        const totalFiles = files.length;
        let completedCount = 0;

        const uploadPromises = Array.from(files).map(async (file) => {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", uploadPreset);
            formData.append("folder", "DriveNest");

            try {
                const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
                    method: "POST",
                    body: formData,
                });

                if (!res.ok) {
                    throw new Error("Upload request failed");
                }

                const data = await res.json();
                
                completedCount++;
                setUploadProgress(Math.round((completedCount / totalFiles) * 100));

                console.log("DriveNest Upload: File uploaded successfully:", data.secure_url);
                return data.secure_url;
            } catch (err) {
                console.error("DriveNest Upload: Individual file upload error:", err);
                throw err;
            }
        });

        try {
            const uploadedUrls = await Promise.all(uploadPromises);
            console.log("DriveNest Upload: All files uploaded successfully:", uploadedUrls);
            setSelectedFileList(prev => {
                const updatedList = [...prev, ...uploadedUrls];
                setTimeout(() => {
                    if (setImages) {
                        setImages(updatedList);
                    }
                }, 0);
                return updatedList;
            });
        } catch (error) {
            console.error("DriveNest Upload: Cloudinary batch upload error:", error);
            alert("Failed to upload one or more images. Please check your Cloudinary configuration & upload presets.");
        } finally {
            setUploading(false);
        }
    }
    
    const onFileSelected = async (event)=>{
        const files = event.target.files;
        console.log("DriveNest Upload: Files selected via dialog:", files);
        await uploadFiles(files);
    }

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer) {
            e.dataTransfer.dropEffect = 'copy';
        }
    };

    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer) {
            e.dataTransfer.dropEffect = 'copy';
        }
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const getDroppedImageUrl = (dataTransfer) => {
        const extractImageUrlParam = (urlString) => {
            if (!urlString) return null;
            try {
                const parsed = new URL(urlString);
                // Google Images redirect parameter
                let directUrl = parsed.searchParams.get('imgurl');
                if (directUrl) {
                    return decodeURIComponent(directUrl);
                }
                // Bing Images redirect parameter
                directUrl = parsed.searchParams.get('mediaurl');
                if (directUrl) {
                    return decodeURIComponent(directUrl);
                }
                // General redirect parameter 'url'
                directUrl = parsed.searchParams.get('url');
                if (directUrl && (directUrl.startsWith('http://') || directUrl.startsWith('https://') || directUrl.includes('%3A%2F%2F'))) {
                    return decodeURIComponent(directUrl);
                }
            } catch (e) {
                // Not a valid URL structure
            }
            return urlString;
        };

        const uriList = dataTransfer.getData('text/uri-list');
        if (uriList) {
            const url = uriList.split('\n')[0].trim();
            if (url) {
                const cleaned = extractImageUrlParam(url);
                if (cleaned) return cleaned;
            }
        }

        const url = dataTransfer.getData('URL');
        if (url) {
            const cleaned = extractImageUrlParam(url.trim());
            if (cleaned) return cleaned;
        }

        const html = dataTransfer.getData('text/html');
        if (html) {
            // First try matching src of img tag
            const matchSrc = html.match(/<img[^>]+src="([^"]+)"/i) || html.match(/src="([^"]+)"/i);
            if (matchSrc && matchSrc[1]) {
                const cleaned = extractImageUrlParam(matchSrc[1].trim());
                if (cleaned) return cleaned;
            }
            // Fallback to match href of anchor tag
            const matchHref = html.match(/<a[^>]+href="([^"]+)"/i) || html.match(/href="([^"]+)"/i);
            if (matchHref && matchHref[1]) {
                const cleaned = extractImageUrlParam(matchHref[1].trim());
                if (cleaned) return cleaned;
            }
        }

        const text = dataTransfer.getData('text/plain');
        if (text && (text.startsWith('http://') || text.startsWith('https://'))) {
            const cleaned = extractImageUrlParam(text.trim());
            if (cleaned) return cleaned;
        }

        return null;
    };

    const handleDrop = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (uploading) return;
        
        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            console.log("DriveNest Dropzone: Local files dropped:", files);
            dropJustOccurredRef.current = true;
            setTimeout(() => {
                dropJustOccurredRef.current = false;
            }, 50);
            await uploadFiles(files);
            return;
        }

        if (e.dataTransfer) {
            const droppedUrl = getDroppedImageUrl(e.dataTransfer);
            if (droppedUrl) {
                console.log("DriveNest Dropzone: Web image URL dropped:", droppedUrl);
                dropJustOccurredRef.current = true;
                setTimeout(() => {
                    dropJustOccurredRef.current = false;
                }, 50);
                await uploadFiles([droppedUrl]);
            } else {
                console.warn("DriveNest Dropzone: Dropped item has no files or image URLs.");
            }
        }
    };

    const onRemoveImage = (indexToRemove) => {
        const updatedList = selectedFileList.filter((_, index) => index !== indexToRemove);
        setSelectedFileList(updatedList);
        if (setImages) {
            setImages(updatedList);
        }
    }

    const onSetAsCover = (indexToCover) => {
        if (indexToCover === 0) return;
        const updatedList = [...selectedFileList];
        const targetImage = updatedList[indexToCover];
        // Move image to position 0
        updatedList.splice(indexToCover, 1);
        updatedList.unshift(targetImage);
        
        setSelectedFileList(updatedList);
        if (setImages) {
            setImages(updatedList);
        }
    }

    return (
        <div>
            <Separator className={`my-5 w-full mx-auto h-px ${isDark ? 'bg-white/10' : 'bg-gray-200'}`} />
            <h2 className='font-bold text-2xl mb-3 mt-4 flex items-center gap-1.5'>
                <span>Upload Car Images</span>
                <span className='text-red-600 font-extrabold'>*</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {selectedFileList.map((image, index)=>(
                    <div key={index} className={`relative group rounded-xl overflow-hidden border-2 transition-all duration-300 ${index === 0 ? 'border-teal-500 shadow-md ring-2 ring-teal-500/20' : isDark ? 'border-white/10' : 'border-slate-200'}`}>
                        {/* Remove Button */}
                        <button
                            type="button"
                            onClick={() => onRemoveImage(index)}
                            className='absolute top-2 right-2 bg-white/90 hover:bg-red-500 hover:text-white text-gray-700 p-1.5 rounded-full cursor-pointer transition-all duration-200 shadow-md hover:scale-110 flex items-center justify-center z-25'
                        >
                            <IoClose className='w-4 h-4' />
                        </button>
                        
                        {/* Cover Badge / Cover Selector */}
                        {index === 0 ? (
                            <div className='absolute bottom-2 left-2 bg-teal-600/90 text-white text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1 shadow-md border border-white/20 z-20'>
                                <IoStar className='w-3 h-3 text-yellow-300 fill-yellow-300' />
                                <span>Cover</span>
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={() => onSetAsCover(index)}
                                className='absolute bottom-2 left-2 bg-black/75 hover:bg-teal-600 text-white text-[10px] font-bold px-2.5 py-1 rounded flex items-center gap-1 cursor-pointer transition-all duration-200 opacity-0 group-hover:opacity-100 shadow-md z-20 border border-white/10 hover:border-teal-500/20 hover:scale-105'
                            >
                                <IoStar className='w-3 h-3 text-slate-300' />
                                <span>Set as Cover</span>
                            </button>
                        )}

                        {/* Image preview */}
                        <img src={image} className="h-32 w-full object-cover transition-transform duration-500 group-hover:scale-105" alt="Car preview" />
                    </div>
                ))}
                <div 
                    onClick={() => {
                        if (!uploading && !dropJustOccurredRef.current) {
                            console.log("DriveNest Dropzone: Clicked to open file chooser");
                            document.getElementById('upload-images').click();
                        }
                    }}
                    className={`cursor-pointer ${uploading ? "pointer-events-none opacity-60" : ""}`}
                    onDragOver={handleDragOver}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <div className={`flex flex-col items-center justify-center pointer-events-none rounded-xl border-dashed border-2 p-20 hover:scale-102 transition-all duration-300 h-32 w-full ${
                        isDragging 
                            ? isDark 
                                ? 'bg-teal-950/30 border-teal-400 text-teal-300 scale-105 shadow-xl shadow-teal-500/10' 
                                : 'bg-teal-100 border-teal-500 text-teal-600 scale-105 shadow-lg shadow-teal-500/15'
                            : isDark 
                                ? 'bg-teal-950/15 border-teal-800 text-teal-400 hover:bg-teal-950/30' 
                                : 'bg-teal-50 border-teal-400 text-gray-500 hover:shadow-lg'
                    }`}>
                        {uploading ? (
                            <div className="w-full max-w-40 flex flex-col items-center">
                                <span className="text-teal-600 text-xs font-bold mb-2">
                                    Uploading ({uploadProgress}%)
                                </span>
                                <div className="w-full bg-teal-200/50 rounded-full h-1.5 overflow-hidden border border-teal-200">
                                    <div 
                                        className="bg-teal-600 h-full rounded-full transition-all duration-300 ease-out" 
                                        style={{ width: `${uploadProgress}%` }}
                                    />
                                </div>
                            </div>
                        ) : isDragging ? (
                            <>
                                <h2 className={`text-4xl animate-bounce ${isDark ? 'text-teal-300' : 'text-teal-600'}`} >↓</h2>
                                <h2 className={`text-center text-sm font-bold ${isDark ? 'text-teal-300' : 'text-teal-600'}`}>Drop images here!</h2>
                            </>
                        ) : (
                            <>
                                <h2 className={`text-4xl ${isDark ? 'text-teal-400' : 'text-gray-500'}`} >+</h2>
                                <h2 className={`text-center text-sm font-medium ${isDark ? 'text-teal-400/80' : 'text-gray-500'}`}>Upload Images</h2>
                            </>
                        )}
                    </div>
                </div>
                <input type="file" multiple={true} id="upload-images" className='hidden' 
                onChange={onFileSelected} disabled={uploading} />
            </div>
        </div>
    )
}

export default ImagesUpload