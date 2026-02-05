import svgPaths from '../../svg-yt0h61sbfi'
import imgWhiteLogo1 from "/images/3.png";

const Footer = () => {
    return (
        <>
            <footer className="relative mt-20 bg-black pt-5 text-white">
                <div className="max-w-480 mx-auto px-8">
                    <h2 className="text-6xl font-bold mb-4 text-left">MỜI BẠN KHÁM PHÁ</h2>

                    <div className="pt-5">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-2 border-b border-white/20">
                            {/* Column 1 */}
                            <div className="space-y-4">
                                <a href="#" className="block hover:text-cyan-300 transition-colors cursor-pointer">Trang chủ</a>
                                <a href="#" className="block hover:text-cyan-300 transition-colors cursor-pointer">Các dự án</a>
                                <a href="#" className="block hover:text-cyan-300 transition-colors cursor-pointer">Xưởng ý tưởng</a>
                            </div>

                            {/* Column 2 */}
                            <div className="space-y-4">
                                <a href="#" className="block hover:text-cyan-300 transition-colors cursor-pointer">Tin tức</a>
                                <a href="#" className="block hover:text-cyan-300 transition-colors cursor-pointer">Hỗ trợ</a>
                                <a href="#" className="block hover:text-cyan-300 transition-colors cursor-pointer">Về chúng tôi</a>
                            </div>

                            {/* Column 3 - Contact Icons */}
                            <div className="flex justify-end items-end text-end">
                                <a href="#" className="hover:opacity-80 transition-opacity cursor-pointer">
                                    <svg className="w-30 h-30 m-0 p-0" fill="#E5E5E5" viewBox="0 0 146 32.6091">
                                        <path d={svgPaths.p150df600} />
                                    </svg>
                                </a>
                                <a href="#" className="hover:opacity-80 transition-opacity cursor-pointer">
                                    <svg className="w-30 h-30" fill="#E5E5E5" viewBox="0 0 146 32.6091">
                                        <path d={svgPaths.p350c4280} />
                                    </svg>
                                </a>
                                <a href="#" className="hover:opacity-80 transition-opacity cursor-pointer">
                                    <svg className="w-30 h-30" fill="#E5E5E5" viewBox="0 0 146 32.6091">
                                        <path d={svgPaths.pb61ae00} />
                                    </svg>
                                </a>
                            </div>
                        </div>

                        {/* Logo */}
                        <div className="flex flex-row items-center justify-between gap-2">
                            <div className='flex flex-row items-center cursor-pointer'>
                                <div className="h-12 w-12 rounded-lg flex items-center justify-center" style={{ backgroundImage: "linear-gradient(90.75deg, rgb(154, 255, 255) 7.08%, rgb(41, 159, 229) 49.625%, rgb(71, 142, 238) 87.958%)" }}>
                                    <img src={imgWhiteLogo1} alt="Fundtalk Logo" className="h-8 w-8 object-contain" />
                                </div>
                                <span className="font-bold text-white">Fundtalk</span>
                            </div>

                            <p className="text-center opacity-80">Copyright @ 2025 Fundtalk</p>
                        </div>

                        {/* Copyright */}

                    </div>
                </div>
            </footer>
        </>
    )
}

export default Footer