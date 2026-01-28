import imgDiv from "/images/background/topBackground.png";
import imgDivHeroBackgroundTop from "/images/background/topBackground.png";

const BaseTopBackground = () => {
    return (
        <>
            <div className="absolute top-0 left-0 right-0  overflow-hidden pointer-events-none">
                <img src={imgDivHeroBackgroundTop} alt="" className="w-full h-full object-fill" />
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: "linear-gradient(rgba(183, 164, 251, 0) 0%, rgb(183, 164, 251) 100%)",
                        maskImage: `url('${imgDiv}')`,
                        maskSize: 'cover'
                    }}
                />
            </div>
        </>
    )
}

export default BaseTopBackground