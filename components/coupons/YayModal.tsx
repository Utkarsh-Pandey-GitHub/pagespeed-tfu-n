import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog"
import Image from "next/image"

export default function YayModal({ showYayModal, setShowYayModal, coupon }: { showYayModal: boolean, setShowYayModal: any, coupon: any }) {

    const handleOpenChange = (open: boolean) => {
        if (open) {
            setShowYayModal(open);
        }
    }

    return (
        <>
            <Dialog open={showYayModal} onOpenChange={handleOpenChange}>
                <DialogContent background={
                    <Image
                        src="/coupons/woBgConfetti.gif"
                        alt="Confetti animation gif"
                        width={500}
                        height={300}
                        className="mx-auto relative top-16 z-[999]"
                    />
                } withClose={false} className="w-[90%] md:w-full md:max-w-[425px] px-2.5 pb-[15px] bg-white rounded-lg shadow flex-col justify-start items-center space-y-6 inline-flex">
                    <div className="absolute -top-12">
                        <Image
                            src={"/coupons/yayModalColor.svg"}
                            alt="Image of yay a coupon"
                            height={84}
                            width={84}
                        />
                    </div>
                    <div className="flex-col justify-start items-center gap-3.5 flex">
                        <div className="self-stretch text-center text-[#686b78] text-xl font-extrabold font-['Poppins']">‘{coupon?.code}’  APPLIED</div>
                        <div className="w-10 h-1 bg-[#595c68] rounded-[19px]" />
                        <div className="self-stretch text-center text-[#7e808c] text-base font-semibold font-['Poppins'] leading-snug">{coupon?.description}</div>
                    </div>
                    <div className="self-stretch flex-col justify-start items-center gap-2.5 flex">
                        <div className="h-[0px] border w-full border-dashed border-black/40"></div>
                        <div className="self-stretch h-[35px] text-center text-[#fd6050] text-xl font-extrabold font-['Poppins']">YAY!</div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}