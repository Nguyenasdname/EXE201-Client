/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import svgPaths from "../svg-yt0h61sbfi";
import imgDivHeroLights1 from "/images/background/bodyBackgroundCreateProject.png";
import Header from '../components/Header';
import BaseLayout from '../layouts/BaseTopBackground';
import Footer from '../components/Footer';
import { toast } from 'react-toastify';
import UploadProjectImages from '../components/UploadProjectImages';
import { useGet } from '../hooks/useGet';
import type { projectPackage } from '../interface';
import ProjectPackage from '../components/ProjectPackage';
import { bankOptions } from '../constants/BankOption';
import Select from 'react-select'
import { useNavigate } from 'react-router-dom';

const CreateProjectPage = () => {
    const [formData, setFormData] = useState({
        projectName: '',
        projectType: '',
        projectId: '',
        briefIntro: '',
        brandImage: [] as File[],
        activityImage: [] as File[],
        summary: '',
        brandStory: '',
        videoLink: '',
        totalCallValue: '',
        issueQuantity: '',
        openTime: '',
        capitalGoal: '',
        businessName: '',
        taxId: '',
        bankAccount: '',
        bankName: '',
        transparencyCommitment: '',
        officeAddress: '',
        representative: '',
        contactEmail: '',
        phoneNumber: '',
        agreedToTerms: false,
        selectedPackage: null as string | null
    });

    const navigate = useNavigate()

    const [errors, setErrors] = useState<Record<string, string>>({});

    const { data: projectPackageData } = useGet<projectPackage[]>('/projectPackage')

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, agreedToTerms: e.target.checked }));
    };

    const handleSelectPackage = (packageId: string) => {
        setFormData(prev => ({ ...prev, selectedPackage: packageId }));
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        const addError = (field: keyof typeof formData, message: string) => {
            newErrors[field as string] = message;
        };

        if (!formData.projectName.trim()) addError('projectName', 'Vui lòng nhập tên dự án');
        if (!formData.projectType.trim()) addError('projectType', 'Vui lòng chọn hoặc nhập loại dự án');
        if (!formData.briefIntro.trim()) addError('briefIntro', 'Vui lòng nhập giới thiệu ngắn gọn về dự án');
        if (!formData.summary.trim()) addError('summary', 'Vui lòng nhập phần tóm tắt dự án');
        if (!formData.brandStory.trim()) addError('brandStory', 'Vui lòng kể câu chuyện thương hiệu');
        if (!formData.businessName.trim()) addError('businessName', 'Vui lòng nhập tên doanh nghiệp / tổ chức');
        if (!formData.taxId.trim()) addError('taxId', 'Vui lòng nhập mã số thuế');
        if (!formData.representative.trim()) addError('representative', 'Vui lòng nhập tên người đại diện');
        if (!formData.officeAddress.trim()) addError('officeAddress', 'Vui lòng nhập địa chỉ văn phòng');
        if (!formData.contactEmail.trim()) addError('contactEmail', 'Vui lòng nhập email liên hệ');
        if (!formData.phoneNumber.trim()) addError('phoneNumber', 'Vui lòng nhập số điện thoại liên hệ');
        if (!formData.bankName.trim()) addError('bankName', 'Vui lòng nhập tên ngân hàng');
        if (!formData.bankAccount.trim()) addError('bankAccount', 'Vui lòng nhập số tài khoản ngân hàng');
        if (!formData.capitalGoal.trim()) addError('capitalGoal', 'Vui lòng nhập mục tiêu sử dụng vốn')


        if (formData.brandImage.length === 0) addError('brandImage', 'Vui lòng upload ít nhất 1 ảnh thương hiệu (logo, banner...)');
        if (formData.activityImage.length === 0) addError('activityImage', 'Vui lòng upload ít nhất 1 hình ảnh hoạt động');

        if (!formData.agreedToTerms) addError('agreedToTerms', 'Bạn cần đồng ý với điều khoản để tiếp tục');

        if (formData.contactEmail.trim()) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.contactEmail.trim())) {
                addError('contactEmail', 'Định dạng email không hợp lệ');
            }
        }

        if (formData.phoneNumber.trim()) {
            const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})\b/;
            if (!phoneRegex.test(formData.phoneNumber.replace(/\s/g, ''))) {
                addError('phoneNumber', 'Số điện thoại không hợp lệ (VD: 0901234567)');
            }
        }

        if (formData.videoLink.trim()) {
            const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
            const vimeoRegex = /^(https?:\/\/)?(www\.)?vimeo\.com\/.+/;
            if (!youtubeRegex.test(formData.videoLink) && !vimeoRegex.test(formData.videoLink)) {
                addError('videoLink', 'Link video chỉ hỗ trợ YouTube hoặc Vimeo');
            }
        }

        if (!formData.selectedPackage) {
            addError('selectedPackage', 'Vui lòng chọn một gói tham gia');
        }

        const numericFields = [
            { field: 'totalCallValue' as const, label: 'Tổng giá trị gọi vốn' },
            { field: 'issueQuantity' as const, label: 'Số lượng phát hành' },
        ];

        numericFields.forEach(({ field, label }) => {
            const value = formData[field].trim();
            if (value && (isNaN(Number(value)) || Number(value) <= 0)) {
                addError(field, `${label} phải là số dương`);
            }
        });

        // if (formData.openTime) {
        //     const openDate = new Date(formData.openTime);
        //     if (isNaN(openDate.getTime()) || openDate <= new Date()) {
        //         addError('openTime', 'Thời gian mở phải là một ngày hợp lệ trong tương lai');
        //     }
        // }

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            setTimeout(() => setErrors({}), 4000);
        }

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) {
            toast.error('Vui lòng kiểm tra lại các trường bị lỗi');
            return;
        }
        console.log('Form submitted:', formData);
        const project = formData

        setTimeout(() => navigate('/payment', { state: project }), 2000)
        toast.success('Dự án đã được nộp thành công!');
    };

    const handleFormChange = (field: keyof typeof formData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="min-h-screen bg-black text-white overflow-x-hidden">
            <Header />

            <div className="relative pt-32 pb-20 overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute inset-0" style={{
                        backgroundImage: "radial-gradient(ellipse at center, rgba(17,17,96,0.7) 0%, rgba(17,17,96,0) 70%)"
                    }} />
                </div>

                <BaseLayout />

                <div className="relative max-w-300 mx-auto px-8 text-center">
                    <h1 className="text-6xl font-bold mb-4 text-shadow-[0px_4px_16px_rgba(154,255,255,0.5)]">
                        Khởi tạo dự án
                    </h1>
                    <p className="text-2xl mb-6">Bắt đầu hành trình cùng cộng đồng</p>
                    <p className="text-xl opacity-80">Chia sẻ ý tưởng và kêu gọi đồng hành cho dự án của bạn.</p>
                </div>
            </div>

            <div className="relative w-full px-8 py-16">
                <div className="absolute top-0 inset-0 rounded-[30px]">
                    <img src={imgDivHeroLights1} alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0" style={{
                        backgroundImage: "radial-gradient(ellipse at center, rgba(113,61,255,0.2) 0%, rgba(113,61,255,0) 70%)"
                    }} />
                </div>

                <form onSubmit={handleSubmit} className="relative space-y-20 max-w-300 mx-auto">
                    {/* Section 1: Thông tin cơ bản */}
                    <section>
                        <h2 className="text-5xl font-bold mb-12 text-shadow-[0px_4px_16px_rgba(154,255,255,0.5)]">
                            Thông tin cơ bản
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            <div>
                                <div className="flex justify-between mb-2">
                                    <label className="text-2xl italic font-medium">Tên dự án <span className="text-red-500">*</span></label>
                                    {errors.projectName && <p className="text-red-500 text-sm">{errors.projectName}</p>}
                                </div>
                                <input
                                    type="text"
                                    name="projectName"
                                    value={formData.projectName}
                                    onChange={handleInputChange}
                                    placeholder="Nhập tên dự án"
                                    className={`w-full px-6 py-4 bg-white border-2 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none transition-colors ${errors.projectName ? 'border-red-500 shadow-red-200 shadow-md animate-pulse' : 'border-[#e4c8ed] focus:border-purple-400'
                                        }`}
                                />
                            </div>

                            <div>
                                <div className="flex justify-between mb-2">
                                    <label className="text-2xl italic font-medium">Loại dự án <span className="text-red-500">*</span></label>
                                    {errors.projectType && <p className="text-red-500 text-sm">{errors.projectType}</p>}
                                </div>
                                <input
                                    type="text"
                                    name="projectType"
                                    value={formData.projectType}
                                    onChange={handleInputChange}
                                    placeholder="Ví dụ: F&B, Công nghệ..."
                                    className={`w-full px-6 py-4 bg-white border-2 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none transition-colors ${errors.projectType ? 'border-red-500 shadow-red-200 shadow-md animate-pulse' : 'border-[#e4c8ed] focus:border-purple-400'
                                        }`}
                                />
                            </div>
                        </div>

                        <div className="mb-8">
                            <div className="flex justify-between mb-2">
                                <label className="text-2xl italic font-medium">Giới thiệu ngắn <span className="text-red-500">*</span></label>
                                {errors.briefIntro && <p className="text-red-500 text-sm">{errors.briefIntro}</p>}
                            </div>
                            <textarea
                                name="briefIntro"
                                value={formData.briefIntro}
                                onChange={handleInputChange}
                                placeholder="Mô tả ngắn gọn về dự án"
                                rows={4}
                                className={`w-full px-6 py-4 bg-white border-2 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none transition-colors resize-none ${errors.briefIntro ? 'border-red-500 shadow-red-200 shadow-md animate-pulse' : 'border-[#e4c8ed] focus:border-purple-400'
                                    }`}
                            />
                        </div>

                        <UploadProjectImages
                            brandImage={formData.brandImage}
                            activityImage={formData.activityImage}
                            setBrandImage={(files: File[]) => handleFormChange('brandImage', files)}
                            setActivityImage={(files: File[]) => handleFormChange('activityImage', files)}
                        />
                    </section>

                    {/* Section 2: Tóm tắt & Câu chuyện */}
                    <section>
                        <h2 className="text-5xl font-bold mb-12 text-shadow-[0px_4px_16px_rgba(154,255,255,0.5)]">
                            Tóm tắt & Câu chuyện thương hiệu
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div>
                                <div className="flex justify-between mb-2">
                                    <label className="text-2xl italic font-medium">Tóm tắt ngắn <span className="text-red-500">*</span></label>
                                </div>
                                <textarea
                                    name="summary"
                                    value={formData.summary}
                                    onChange={handleInputChange}
                                    placeholder="Tóm tắt dự án"
                                    rows={5}
                                    className={`w-full px-6 py-4 bg-white border-2 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none transition-colors resize-none ${errors.summary ? 'border-red-500 shadow-red-200 shadow-md animate-pulse' : 'border-[#e4c8ed] focus:border-purple-400'
                                        }`}
                                />
                                {errors.summary && <p className="text-red-500 text-sm">{errors.summary}</p>}
                            </div>

                            <div>
                                <div className="flex justify-between mb-2">
                                    <label className="text-2xl italic font-medium">Câu chuyện & sứ mệnh <span className="text-red-500">*</span></label>
                                </div>
                                <textarea
                                    name="brandStory"
                                    value={formData.brandStory}
                                    onChange={handleInputChange}
                                    placeholder="Kể câu chuyện thương hiệu"
                                    rows={5}
                                    className={`w-full px-6 py-4 bg-white border-2 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none transition-colors resize-none ${errors.brandStory ? 'border-red-500 shadow-red-200 shadow-md animate-pulse' : 'border-[#e4c8ed] focus:border-purple-400'
                                        }`}
                                />
                                {errors.brandStory && <p className="text-red-500 text-sm">{errors.brandStory}</p>}
                            </div>

                            <div>
                                <div className="flex justify-between mb-2">
                                    <label className="text-2xl italic font-medium">Video giới thiệu</label>
                                </div>
                                <textarea
                                    name="videoLink"
                                    value={formData.videoLink}
                                    onChange={handleInputChange}
                                    placeholder="Dán link YouTube hoặc Vimeo"
                                    rows={5}
                                    className={`w-full px-6 py-4 bg-white border-2 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none transition-colors resize-none ${errors.videoLink ? 'border-red-500 shadow-red-200 shadow-md animate-pulse' : 'border-[#e4c8ed] focus:border-purple-400'
                                        }`}
                                />
                                {errors.videoLink && <p className="text-red-500 text-sm">{errors.videoLink}</p>}
                            </div>
                        </div>
                    </section>

                    {/* Section 3: Thông tin kêu gọi vốn */}
                    <section>
                        <h2 className="text-5xl font-bold mb-12 text-shadow-[0px_4px_16px_rgba(154,255,255,0.5)]">
                            Thông tin kêu gọi vốn
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <div className="flex justify-between mb-2">
                                    <label className="text-2xl italic font-medium">Tổng giá trị kêu gọi</label>
                                </div>
                                <input
                                    type="text"
                                    name="totalCallValue"
                                    value={formData.totalCallValue}
                                    onChange={handleInputChange}
                                    placeholder="Ví dụ: 500000000"
                                    className={`w-full px-6 py-4 bg-white border-2 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none transition-colors ${errors.totalCallValue ? 'border-red-500 shadow-red-200 shadow-md animate-pulse' : 'border-[#e4c8ed] focus:border-purple-400'
                                        }`}
                                />
                                {errors.totalCallValue && <p className="text-red-500 text-sm">{errors.totalCallValue}</p>}
                            </div>

                            {/* <div>
                                <div className="flex justify-between mb-2">
                                    <label className="text-2xl italic font-medium">Số lượng phát hành</label>
                                </div>
                                <input
                                    type="text"
                                    name="issueQuantity"
                                    value={formData.issueQuantity}
                                    onChange={handleInputChange}
                                    placeholder="Ví dụ: 10000"
                                    className={`w-full px-6 py-4 bg-white border-2 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none transition-colors ${errors.issueQuantity ? 'border-red-500 shadow-red-200 shadow-md animate-pulse' : 'border-[#e4c8ed] focus:border-purple-400'
                                        }`}
                                />
                                {errors.issueQuantity && <p className="text-red-500 text-sm">{errors.issueQuantity}</p>}
                            </div> */}

                            {/* <div>
                                <div className="flex justify-between mb-2">
                                    <label className="text-2xl italic font-medium">Thời gian mở bán</label>
                                    {errors.openTime && <p className="text-red-500 text-sm">{errors.openTime}</p>}
                                </div>
                                <input
                                    type="text"
                                    name="openTime"
                                    value={formData.openTime}
                                    onChange={handleInputChange}
                                    placeholder="Ví dụ: 15/03/2026"
                                    className={`w-full px-6 py-4 bg-white border-2 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none transition-colors ${errors.openTime ? 'border-red-500 shadow-red-200 shadow-md animate-pulse' : 'border-[#e4c8ed] focus:border-purple-400'
                                        }`}
                                />
                            </div> */}

                            <div>
                                <div className="flex justify-between mb-2">
                                    <label className="text-2xl italic font-medium">Mục tiêu sử dụng vốn</label>
                                </div>
                                <input
                                    type="text"
                                    name="capitalGoal"
                                    value={formData.capitalGoal}
                                    onChange={handleInputChange}
                                    placeholder="Mô tả mục đích sử dụng vốn"
                                    className={`w-full px-6 py-4 bg-white border-2 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none transition-colors ${errors.capitalGoal ? 'border-red-500 shadow-red-200 shadow-md animate-pulse' : 'border-[#e4c8ed] focus:border-purple-400'
                                        }`}
                                />
                                {errors.capitalGoal && <p className="text-red-500 text-sm">{errors.capitalGoal}</p>}
                            </div>
                        </div>
                    </section>

                    {/* Section 4: Các gói tham gia */}
                    <section>
                        <h2 className="text-5xl font-bold mb-12 text-shadow-[0px_4px_16px_rgba(154,255,255,0.5)]">
                            Các gói tham gia
                            <span className="text-red-500">*</span>
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {projectPackageData && projectPackageData?.length > 0 && (
                                <>
                                    {projectPackageData.map(projectPackage => (
                                        <ProjectPackage
                                            key={projectPackage._id}
                                            projectPackage={projectPackage}
                                            handleSelectPackage={handleSelectPackage}
                                            selectedPackage={formData.selectedPackage}
                                        />
                                    ))}
                                </>
                            )}
                        </div>
                        {errors.selectedPackage && (
                            <p className="text-red-500 text-center mt-6 text-lg">
                                {errors.selectedPackage}
                            </p>
                        )}
                    </section>

                    {/* Section 5: Thông tin tài chính & minh bạch */}
                    <section>
                        <h2 className="text-5xl font-bold mb-12 text-shadow-[0px_4px_16px_rgba(154,255,255,0.5)]">
                            Thông tin tài chính & minh bạch
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                            <div>
                                <div className="flex justify-between mb-2">
                                    <label className="text-2xl italic font-medium">Tên doanh nghiệp <span className="text-red-500">*</span></label>
                                    {errors.businessName && <p className="text-red-500 text-sm">{errors.businessName}</p>}
                                </div>
                                <input
                                    type="text"
                                    name="businessName"
                                    value={formData.businessName}
                                    onChange={handleInputChange}
                                    placeholder="Tên công ty / tổ chức"
                                    className={`w-full px-6 py-4 bg-white border-2 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none transition-colors ${errors.businessName ? 'border-red-500 shadow-red-200 shadow-md animate-pulse' : 'border-[#e4c8ed] focus:border-purple-400'
                                        }`}
                                />
                            </div>

                            <div>
                                <div className="flex justify-between mb-2">
                                    <label className="text-2xl italic font-medium">Mã số thuế <span className="text-red-500">*</span></label>
                                    {errors.taxId && <p className="text-red-500 text-sm">{errors.taxId}</p>}
                                </div>
                                <input
                                    type="text"
                                    name="taxId"
                                    value={formData.taxId}
                                    onChange={handleInputChange}
                                    placeholder="Mã số thuế"
                                    className={`w-full px-6 py-4 bg-white border-2 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none transition-colors ${errors.taxId ? 'border-red-500 shadow-red-200 shadow-md animate-pulse' : 'border-[#e4c8ed] focus:border-purple-400'
                                        }`}
                                />
                            </div>

                            <div>
                                <div className="flex justify-between mb-2">
                                    <label className="text-2xl italic font-medium">Số tài khoản ngân hàng <span className="text-red-500">*</span></label>
                                    {errors.bankAccount && <p className="text-red-500 text-sm">{errors.bankAccount}</p>}
                                </div>
                                <input
                                    type="text"
                                    name="bankAccount"
                                    value={formData.bankAccount}
                                    onChange={handleInputChange}
                                    placeholder="Số tài khoản"
                                    className={`w-full px-6 py-4 bg-white border-2 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none transition-colors ${errors.bankAccount ? 'border-red-500 shadow-red-200 shadow-md animate-pulse' : 'border-[#e4c8ed] focus:border-purple-400'
                                        }`}
                                />
                            </div>

                            {/* <div>
                                <div className="flex justify-between mb-2">
                                    <label className="text-2xl italic font-medium">Tên ngân hàng <span className="text-red-500">*</span></label>
                                    {errors.bankName && <p className="text-red-500 text-sm">{errors.bankName}</p>}
                                </div>
                                <input
                                    type="text"
                                    name="bankName"
                                    value={formData.bankName}
                                    onChange={handleInputChange}
                                    placeholder="Tên ngân hàng"
                                    className={`w-full px-6 py-4 bg-white border-2 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none transition-colors ${errors.bankName ? 'border-red-500 shadow-red-200 shadow-md animate-pulse' : 'border-[#e4c8ed] focus:border-purple-400'
                                        }`}
                                />
                            </div> */}
                            <div>
                                <div className="flex justify-between mb-2">
                                    <label className="text-2xl italic font-medium">Tên ngân hàng <span className="text-red-500">*</span></label>
                                    {errors.bankName && <p className="text-red-500 text-sm">{errors.bankName}</p>}
                                </div>

                                <Select
                                    options={bankOptions}
                                    value={bankOptions.find(option => option.value === formData.bankName) || null}
                                    onChange={(selected: any) => handleInputChange({ target: { name: 'bankName', value: selected?.value || '' } } as any)}
                                    formatOptionLabel={(option: any) => (
                                        <div className="flex items-center gap-4">
                                            {option.logo ? (
                                                <img src={option.logo} alt={option.label} className="h-9 w-9 object-contain" />
                                            ) : (
                                                <div>
                                                </div>
                                            )}
                                            <span className="text-gray-800 italic">{option.label}</span>
                                        </div>
                                    )}
                                    placeholder="Chọn ngân hàng..."
                                    isSearchable={true}
                                    classNamePrefix="bank-select"
                                    styles={{
                                        control: (base) => ({
                                            ...base,
                                            backgroundColor: 'white',
                                            borderColor: errors.bankName ? '#ef4444' : '#e4c8ed',
                                            borderWidth: '2px',
                                            borderRadius: '0.5rem',
                                            padding: '0.5rem 0.5rem 0.5rem 1rem',
                                            boxShadow: errors.bankName ? '0 0 20px rgba(239, 68, 68, 0.3)' : 'none',
                                            '&:hover': { borderColor: '#a78bfa' },
                                            transition: 'all 0.3s',
                                        }),
                                        menu: (base) => ({
                                            ...base,
                                            backgroundColor: 'white',
                                            borderRadius: '0.5rem',
                                            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                                            zIndex: 9999,
                                        }),
                                        option: (base, state) => ({
                                            ...base,
                                            backgroundColor: state.isSelected ? '#a78bfa' : state.isFocused ? '#f3e8ff' : 'white',
                                            color: state.isSelected ? 'white' : '#1f2937',
                                            padding: '12px 16px',
                                            cursor: 'pointer',
                                        }),
                                    }}
                                    noOptionsMessage={() => "Không tìm thấy ngân hàng"}
                                />
                            </div>
                        </div>
                    </section>

                    {/* Section 6: Địa chỉ & Liên hệ */}
                    <section>
                        <h2 className="text-5xl font-bold mb-12 text-shadow-[0px_4px_16px_rgba(154,255,255,0.5)]">
                            Địa chỉ & Liên hệ
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                            <div>
                                <div className="flex justify-between mb-2">
                                    <label className="text-2xl italic font-medium">Địa chỉ trụ sở <span className="text-red-500">*</span></label>
                                    {errors.officeAddress && <p className="text-red-500 text-sm">{errors.officeAddress}</p>}
                                </div>
                                <input
                                    type="text"
                                    name="officeAddress"
                                    value={formData.officeAddress}
                                    onChange={handleInputChange}
                                    placeholder="Địa chỉ văn phòng"
                                    className={`w-full px-6 py-4 bg-white border-2 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none transition-colors ${errors.officeAddress ? 'border-red-500 shadow-red-200 shadow-md animate-pulse' : 'border-[#e4c8ed] focus:border-purple-400'
                                        }`}
                                />
                            </div>

                            <div>
                                <div className="flex justify-between mb-2">
                                    <label className="text-2xl italic font-medium">Người đại diện dự án <span className="text-red-500">*</span></label>
                                    {errors.representative && <p className="text-red-500 text-sm">{errors.representative}</p>}
                                </div>
                                <input
                                    type="text"
                                    name="representative"
                                    value={formData.representative}
                                    onChange={handleInputChange}
                                    placeholder="Họ và tên"
                                    className={`w-full px-6 py-4 bg-white border-2 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none transition-colors ${errors.representative ? 'border-red-500 shadow-red-200 shadow-md animate-pulse' : 'border-[#e4c8ed] focus:border-purple-400'
                                        }`}
                                />
                            </div>

                            <div>
                                <div className="flex justify-between mb-2">
                                    <label className="text-2xl italic font-medium">Email liên hệ <span className="text-red-500">*</span></label>
                                    {errors.contactEmail && <p className="text-red-500 text-sm">{errors.contactEmail}</p>}
                                </div>
                                <input
                                    type="email"
                                    name="contactEmail"
                                    value={formData.contactEmail}
                                    onChange={handleInputChange}
                                    placeholder="email@domain.com"
                                    className={`w-full px-6 py-4 bg-white border-2 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none transition-colors ${errors.contactEmail ? 'border-red-500 shadow-red-200 shadow-md animate-pulse' : 'border-[#e4c8ed] focus:border-purple-400'
                                        }`}
                                />
                            </div>

                            <div>
                                <div className="flex justify-between mb-2">
                                    <label className="text-2xl italic font-medium">Số điện thoại <span className="text-red-500">*</span></label>
                                    {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber}</p>}
                                </div>
                                <input
                                    type="tel"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleInputChange}
                                    placeholder="0901234567"
                                    className={`w-full px-6 py-4 bg-white border-2 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none transition-colors ${errors.phoneNumber ? 'border-red-500 shadow-red-200 shadow-md animate-pulse' : 'border-[#e4c8ed] focus:border-purple-400'
                                        }`}
                                />
                            </div>
                        </div>

                        <div className="flex items-start gap-4 mb-8">
                            <div className="relative">
                                <input
                                    type="checkbox"
                                    id="terms"
                                    checked={formData.agreedToTerms}
                                    onChange={handleCheckboxChange}
                                    className="peer sr-only"
                                />
                                <label
                                    htmlFor="terms"
                                    className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border-2 border-white/20 bg-white/10 peer-checked:bg-linear-to-br peer-checked:from-cyan-300 peer-checked:to-blue-500"
                                >
                                    {formData.agreedToTerms && (
                                        <svg className="h-6 w-6" fill="none" viewBox="0 0 28.5 32.9555">
                                            <path clipRule="evenodd" d={svgPaths.pd51cf80} fill="white" fillRule="evenodd" />
                                        </svg>
                                    )}
                                </label>
                            </div>
                            <div>
                                <label htmlFor="terms" className="text-2xl italic font-medium cursor-pointer">
                                    Tôi xác nhận toàn bộ thông tin trên là chính xác và thuộc quyền sở hữu hợp pháp <span className="text-red-500">*</span>
                                </label>
                                {errors.agreedToTerms && (
                                    <p className="text-red-500 text-sm mt-2">{errors.agreedToTerms}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-center">
                            <button
                                type="submit"
                                className="px-12 py-5 rounded-lg shadow-xl text-2xl font-bold hover:scale-105 transition duration-300 ease-in-out cursor-pointer"
                                style={{ backgroundImage: "linear-gradient(206.655deg, rgb(154, 255, 255) 14.425%, rgb(71, 142, 238) 80.609%)" }}
                            >
                                Xác nhận nộp
                            </button>
                        </div>
                    </section>
                </form>
            </div>

            <Footer />
        </div>
    );
};

export default CreateProjectPage;