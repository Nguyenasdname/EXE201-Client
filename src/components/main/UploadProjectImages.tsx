/* eslint-disable react-hooks/static-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { X } from 'lucide-react'

interface UploadProjectImagesProps {
    brandImage: File[];
    activityImage: File[];
    setBrandImage: (files: File[]) => void;
    setActivityImage: (files: File[]) => void;
}

const UploadProjectImages: React.FC<UploadProjectImagesProps> = ({
    brandImage,
    activityImage,
    setBrandImage,
    setActivityImage,
}) => {
    const handleImageChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        type: 'brand' | 'activity',
        replaceIndex?: number // nếu có thì là thay thế ảnh cũ
    ) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const newFiles = Array.from(files);

        if (type === 'brand') {
            if (replaceIndex !== undefined) {
                // Thay thế ảnh tại vị trí
                const updated = [...brandImage];
                updated[replaceIndex] = newFiles[0]; // chỉ thay 1 ảnh
                setBrandImage(updated);
            } else {
                // Thêm mới nhiều ảnh
                setBrandImage([...brandImage, ...newFiles]);
            }
        } else {
            if (replaceIndex !== undefined) {
                const updated = [...activityImage];
                updated[replaceIndex] = newFiles[0];
                setActivityImage(updated);
            } else {
                setActivityImage([...activityImage, ...newFiles]);
            }
        }

        // Reset input để có thể chọn lại cùng file
        e.target.value = '';
    };

    const removeImage = (type: 'brand' | 'activity', index: number) => {
        if (type === 'brand') {
            setBrandImage(brandImage.filter((_, i) => i !== index));
        } else {
            setActivityImage(activityImage.filter((_, i) => i !== index));
        }
    };

    const ImageGrid = ({ images, type, }: { images: File[]; type: 'brand' | 'activity'; }) => {
        const inputId = `upload-${type}`;

        return (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                {/* Các ảnh đã upload */}
                {images.map((file, index) => (
                    <div key={index} className="relative group">
                        <div className="aspect-square rounded-lg overflow-hidden border-2 border-dashed border-transparent hover:border-purple-400 duration-200 transition-colors">
                            <img
                                src={URL.createObjectURL(file)}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-full object-cover cursor-pointer"
                                onClick={() => {
                                    // Click vào ảnh để thay thế
                                    document.getElementById(inputId)?.click();
                                    // Chúng ta sẽ xử lý replaceIndex ở onChange
                                    (document.getElementById(inputId) as any).dataset.replaceIndex = index;
                                }}
                            />

                            {/* Nút xóa - hiện khi hover */}
                            <div
                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 
                                group-hover:opacity-100 transition-opacity cursor-pointer shadow-lg hover:scale-110"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    removeImage(type, index);
                                }}
                            >
                                <X size={16} />
                            </div>

                        </div>
                    </div>
                ))}

                {/* Ô thêm ảnh mới (luôn hiện) */}
                <label
                    htmlFor={inputId}
                    className="aspect-square rounded-lg bg-white border-2 border-dashed border-[#e4c8ed] flex items-center justify-center cursor-pointer hover:border-purple-400 transition-colors"
                >
                    <span
                        className="text-5xl text-transparent bg-clip-text font-light"
                        style={{
                            backgroundImage:
                                "linear-gradient(171.274deg, rgb(228, 200, 237) 9.3169%, rgb(99, 99, 234) 45.285%)",
                        }}
                    >
                        +
                    </span>
                </label>

                {/* Input ẩn */}
                <input
                    id={inputId}
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                        const replaceIndex = (e.target as any).dataset.replaceIndex;
                        handleImageChange(
                            e,
                            type,
                            replaceIndex !== undefined ? Number(replaceIndex) : undefined
                        );
                        // Reset dataset
                        delete (e.target as any).dataset.replaceIndex;
                    }}
                />
            </div>
        );
    };

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-8">
                {/* Ảnh thương hiệu */}
                <div>
                    <label className="block text-2xl italic font-medium mb-6">
                        Ảnh thương hiệu
                        <span className='text-red-500'>*</span>
                    </label>
                    <ImageGrid images={brandImage} type="brand" />
                    <p className="text-sm text-gray-500 mt-3">
                        Khuyến nghị: logo, banner, hình ảnh nhận diện thương hiệu
                    </p>
                </div>

                {/* Hình ảnh hoạt động */}
                <div>
                    <label className="block text-2xl italic font-medium mb-6">
                        Hình ảnh hoạt động
                        <span className='text-red-500'>*</span>
                    </label>
                    <ImageGrid images={activityImage} type="activity" />
                    <p className="text-sm text-gray-500 mt-3">
                        Ảnh sản phẩm, hoạt động thực tế, đội ngũ, sự kiện...
                    </p>
                </div>
            </div>
        </>
    )
}

export default UploadProjectImages