import React, { useState } from 'react'
import { Separator } from "@/components/ui/separator"
import { IoClose, IoStar } from 'react-icons/io5'

function ImagesUpload({ setImages }) {
    const [selectedFileList, setSelectedFileList] = useState([]);
    const [uploading, setUploading] = useState(false);
    
    const onFileSelected = async (event)=>{
        const files = event.target.files;
        if (!files || files.length === 0) return;

        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
        const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

        if (!cloudName || !uploadPreset) {
            alert("Missing Cloudinary configuration. Please add NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET to your .env.local file.");
            return;
        }

        setUploading(true);
        const uploadPromises = Array.from(files).map(async (file) => {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", uploadPreset);
            formData.append("folder", "DriveNest"); // Upload inside the DriveNest folder

            try {
                const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
                    method: "POST",
                    body: formData,
                });

                if (!res.ok) {
                    throw new Error("Upload request failed");
                }

                const data = await res.json();
                return data.secure_url;
            } catch (err) {
                console.error("Individual file upload error:", err);
                throw err;
            }
        });

        try {
            const uploadedUrls = await Promise.all(uploadPromises);
            setSelectedFileList(prev => {
                const updatedList = [...prev, ...uploadedUrls];
                // Return updated list, do NOT call setImages here
                return updatedList;
            });
            // Update parent state outside the updater callback
            if (setImages) {
                setImages([...selectedFileList, ...uploadedUrls]);
            }
        } catch (error) {
            console.error("Cloudinary batch upload error:", error);
            alert("Failed to upload one or more images. Please check your Cloudinary configuration & upload presets.");
        } finally {
            setUploading(false);
        }
    }

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
            <Separator className="my-5 bg-gray-200 w-full mx-auto h-0.5" />
            <h2 className='font-bold text-2xl mb-3 mt-4'>Upload Car Images</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {selectedFileList.map((image, index)=>(
                    <div key={index} className={`relative group rounded-xl overflow-hidden border-2 transition-all duration-300 ${index === 0 ? 'border-teal-500 shadow-md ring-2 ring-teal-500/20' : 'border-slate-200'}`}>
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
                <label htmlFor="upload-images" className={uploading ? "pointer-events-none opacity-60" : ""}>
                    <div className='flex flex-col items-center justify-center cursor-pointer bg-teal-100 rounded-xl border-dotted border-3 border-teal-500 p-20 hover:shadow-lg hover:font-medium hover:scale-102 transition-all duration-200 h-32 w-full'>
                        {uploading ? (
                            <>
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mb-2"></div>
                                <h2 className='text-gray-500 text-center font-bold animate-pulse text-sm'>Uploading...</h2>
                            </>
                        ) : (
                            <>
                                <h2 className='text-4xl text-gray-500' >+</h2>
                                <h2 className='text-gray-500 text-center text-sm font-medium'>Upload Images</h2>
                            </>
                        )}
                    </div>
                </label>
                <input type="file" multiple={true} id="upload-images" className='hidden' 
                onChange={onFileSelected} disabled={uploading} />
            </div>
        </div>
    )
}

export default ImagesUpload