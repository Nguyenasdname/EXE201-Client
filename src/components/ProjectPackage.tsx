import { type projectPackage } from "../interface"

interface ProjectPackageProps {
    projectPackage: projectPackage
    handleSelectPackage: (str: string) => void
    selectedPackage: string | null
}

const ProjectPackage = ({ projectPackage, handleSelectPackage, selectedPackage }: ProjectPackageProps) => {
    return (
        <>
            <div
                onClick={() => handleSelectPackage(projectPackage._id)}
                className={`relative rounded-3xl p-8 backdrop-blur-sm cursor-pointer transition-all duration-300 ${selectedPackage === projectPackage._id
                    ? 'border border-white shadow-[0_0_20px_rgba(255,255,255,0.6)] '
                    : 'border border-white/20 hover:border-white/50'
                    }`}
                style={{
                    backgroundImage: "linear-gradient(rgba(113,61,255,0.1), rgba(113,61,255,0.05))",
                }}
            >
                <h3 className="text-4xl font-bold italic text-center mb-4 text-shadow-[0px_4px_16px_rgba(154,255,255,0.5)]">
                    {projectPackage.packageName}
                </h3>
                <p className="text-xl italic font-semibold mb-6">
                    {projectPackage.packageTitle}
                </p>
                <ul className="space-y-3 text-lg">
                    <li>• Thời Gian: {projectPackage.time} tháng</li>
                    <li>• Cọc: {projectPackage.price.toLocaleString("vi-VN")} VND</li>
                    <li>• Phí thành công từ hệ thống: {projectPackage.successFee}%</li>
                </ul>
            </div>
        </>
    )
}

export default ProjectPackage