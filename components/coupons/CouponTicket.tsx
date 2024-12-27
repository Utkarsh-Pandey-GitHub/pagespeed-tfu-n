import React from 'react'
import YayModal from "./YayModal";

export default function CouponTicket({ coupons, setOpenDrawer, setCouponSelected, setSelectedCoupon, setShowYayModal, showYayModal, selectedCoupon }: { coupons: any[] | undefined, setOpenDrawer: Function, setCouponSelected: Function, setSelectedCoupon: Function, setShowYayModal: Function, showYayModal: boolean, selectedCoupon: boolean }) {

    const [appliedCoupon, setAppliedCoupon] = React.useState<any>();
    React.useEffect(() => {
        let timer: NodeJS.Timeout;
        let appliedTimer: NodeJS.Timeout;
        if (showYayModal) {
            timer = setTimeout(() => {
                setShowYayModal(false);
                setOpenDrawer(false);
            }, 2000);

            appliedTimer = setTimeout(() => {
                !selectedCoupon && setSelectedCoupon(appliedCoupon);
                setCouponSelected(true);
            }, 2500);
        }
        return () => { clearTimeout(timer) };
    }, [showYayModal]);
    return (
        <>
            {showYayModal && (
                <YayModal showYayModal={showYayModal} setShowYayModal={setShowYayModal} coupon={selectedCoupon} />

            )}
            {coupons && coupons?.length > 0 ?
                (
                    <div className='flex flex-col gap-2 md:gap-4 items-center w-full'>
                        {coupons?.map((coupon: any, index: number) => (
                            <>

                                <div
                                    onClick={() => {
                                        setAppliedCoupon(coupon);
                                        setSelectedCoupon(coupon);
                                        setShowYayModal(true);
                                    }}
                                    className="cursor-pointer flex m-2 w-[100%] justify-center items-center bg-white rounded-xl overflow-hidden shadow-md">
                                    <div className="w-1/8 self-stretch bg-gray-800 text-white p-2 py-4 grid place-items-center relative">
                                        <div className="text-lg font-bold ml-2 [writing-mode:vertical-lr] rotate-180">
                                            {coupon?.discountPercent}% OFF
                                        </div>
                                        {[8, 12, 16, 20].map((elem, index) => (
                                            <div
                                                key={elem}
                                                className={`absolute -left-2 top-1/2 transform mt-${elem} -translate-y-1/2 flex flex-col gap-[2px] h-32`}
                                            >
                                                <div className="absolute w-4 h-4 bg-[#e3e2e7] rounded-r-full"></div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex-1 p-4 space-y-4">
                                        <div className="flex justify-between items-center">
                                            <div className="text-[#5d5e61] text-xl font-semibold font-['Inter']">{coupon?.code}</div>
                                            <div className="text-[#fe5200] text-base font-semibold font-['Inter']">APPLY</div>
                                        </div>
                                        <div className="text-[#66af94] text-md font-semibold font-['Inter'] leading-normal">{coupon?.description}</div>
                                    </div>
                                </div>

                            </>
                        ))}

                    </div>
                )
                :
                (
                    <>
                        No Coupons Available
                    </>
                )
            }
        </>
    )
}