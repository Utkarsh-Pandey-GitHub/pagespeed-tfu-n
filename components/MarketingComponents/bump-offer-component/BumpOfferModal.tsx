"use client"

import { useState, useEffect } from 'react'
import mixpanel from "@/utils/mixpanel";
import { X, LoaderPinwheel, Video, Bot } from 'lucide-react'

interface Offer {
  id: number
  name: string
  price: number
  description: string[]
  icon: React.ElementType
}

const offers: Offer[] = [
  {
    id: 1,
    name: "Lifetime Access to Class Recordings",
    price: 49,
    description: [
      "Revisit lessons anytime, sharpen your skills, and never miss a detail!"
    ],
    icon: Video
  },
  {
    id: 2,
    name: "ChatGPT Prompts for Stock Analysis",
    price: 49,
    description: [
      "Get customized ChatGPT prompts designed to analyze stocks, identify trends, and make informed trading decisions."
    ],
    icon: Bot
  }
]
const paymentToken = {
  "49": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhbW91bnQiOjQ5fQ.CxV6Wx22zOtz70T6JXG79RZVCpx5ygSqUTgSf-eNwsA",
  "98": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhbW91bnQiOjk4LCJpYXQiOjE3MzAwMjU0MDh9.2Y1mwj17W7T8sJDn3W2yzhfmMjToDjVx8-LSHwmANeU",
  "147": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhbW91bnQiOjE0NywiaWF0IjoxNzMwMDI1NDcwfQ.00Ed6sL5AHq_ZJJy5hsjcQK8c0FhnRGOtzk1m8_f9iE",
  "99": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhbW91bnQiOjk5fQ.4Ln6tNDxvsLnO_jvL1_pFoRzaEPiaaa5Mxus3KKJEA8",
  "148": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhbW91bnQiOjE0OCwiaWF0IjoxNzMwODU1NDQ3fQ.P2gAsTuUDFGQ3jLNqwyxhtb9hfklVjg4H3MrVV6Dv0A",
  "197": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhbW91bnQiOjE5NywiaWF0IjoxNzMwODU1NTMwfQ.574GmYdEg31faWe4gXQpiwOcyjuKtO0e8--CsWB85kc",
  "199": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhbW91bnQiOjE5OX0.PuzNQ0M-j_JtLU2YKhkEsmXTjHAfx-L389zz-5UhgcY",
  "248": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhbW91bnQiOjI0OCwiaWF0IjoxNzMwODU1NTU0fQ.fMzTNLriBtVESyOQqgYXp0H234wfvK4jQIbMHyR-oiY",
  "297": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhbW91bnQiOjI5NywiaWF0IjoxNzMwODU1NTk3fQ.al_EBBmqpeTQ-5sY1L_W0RSvRxFaRDYtNP5_YoT7qDY",
}
export default function BumpOfferModal({
  bumpOffers = offers,
  isOpen,
  setIsOpen,
  onClose,
  data,
  loading,
  token,
  basePrice,
  redirectLink,
  freePage = false
}: {
  bumpOffers?: Offer[],
  isOpen: boolean,
  setIsOpen: (param: boolean) => void | any,
  onClose: (param1: any, param2?: any, param3?: any, param4?: any) => void | (() => void)
  data: any
  loading: boolean
  token: any
  basePrice: number
  redirectLink?: string
  freePage?: boolean
}) {
  const [selectedOffers, setSelectedOffers] = useState<number[]>([]);
  const [totalPrice, setTotalPrice] = useState(basePrice);

  useEffect(() => {
    const newTotal = selectedOffers.reduce((sum, id) => {
      const offer = offers.find(o => o.id === id)
      return sum + (offer?.price || 0)
    }, basePrice)
    setTotalPrice(newTotal)
  }, [selectedOffers])

  const toggleOffer = (id: number) => {
    mixpanel.track("mrkt_bump_modal", {
      clicked: `${bumpOffers[id]?.name}`,
      removed: `${selectedOffers?.includes(id) ? "yes" : "no"}`
    })
    setSelectedOffers(prev =>
      prev.includes(id) ? prev.filter(offerId => offerId !== id) : [...prev, id]
    )
  }

  const handleSubmit = async () => {
    if (token == paymentToken["49"]) {
      if (selectedOffers.length == 1) {
        await onClose(data, paymentToken["98"], selectedOffers, totalPrice);
      }
      else if (selectedOffers.length == 2) {
        await onClose(data, paymentToken["147"], selectedOffers, totalPrice);
      }
      else {
        await onClose(data, token, selectedOffers, totalPrice);
      }
    }
    else if (token == paymentToken["99"]) {
      if (selectedOffers.length == 1) {
        await onClose(data, paymentToken["148"], selectedOffers, totalPrice);
      }
      else if (selectedOffers.length == 2) {
        await onClose(data, paymentToken["197"], selectedOffers, totalPrice);
      }
      else {
        await onClose(data, token, selectedOffers, totalPrice);
      }
    }
    else if (token == paymentToken["199"]) {
      if (selectedOffers.length == 1) {
        await onClose(data, paymentToken["248"], selectedOffers, totalPrice);
      }
      else if (selectedOffers.length == 2) {
        await onClose(data, paymentToken["297"], selectedOffers, totalPrice);
      }
      else {
        await onClose(data, token, selectedOffers, totalPrice);
      }
    } else {
      if (selectedOffers.length == 1) {
        await onClose(data, paymentToken["49"], selectedOffers, totalPrice);
      }
      else if (selectedOffers.length == 2) {
        await onClose(data, paymentToken["98"], selectedOffers, totalPrice);
      } else {
        if (redirectLink)
          window.location.href = redirectLink
        else window.location.href = "https://tradewiseapp.com"
      }
    }
  }

  return (
    <div>
      {isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 !z-50">
        <div className="bg-white rounded-lg w-full max-w-lg relative shadow-2xl flex flex-col " style={{ maxHeight: 'calc(100vh - 2rem)' }}>
          <button onClick={() => { setIsOpen(false) }} className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 transition-colors duration-200 z-10">
            <X size={24} />
            <span className="sr-only">Close</span>
          </button>
          <div className="p-6 overflow-y-auto flex-grow">
            <h2 className="text-3xl font-bold mb-4 text-gray-800">
              Upgrade <br className='sm:hidden' /> Your Trading Experience!
            </h2>
            <p className="mb-6 text-gray-600">Exclusive Add-On for a Limited Time</p>
            <div className="grid grid-cols-1   overflow-y-auto overflow-x-hidden h-full" style={{
              maxHeight: 'calc(100vh - 6rem)',
              scrollbarWidth: 'none',
            }}>
              {bumpOffers.map((offer, index) => {
                const Icon = offer.icon
                return (
                  <div
                    key={offer.id}
                    className={`p-4 rounded-lg transition-all duration-300 w-full transform shadow-md mb-3 ${selectedOffers.includes(offer.id)
                      ? 'bg-blue-50 scale-[1.01] shadow-lg relative'
                      : 'bg-gray-50'
                      }`}
                  >
                    {selectedOffers.includes(offer.id) && <div className="absolute inset-0 bg-[linear-gradient(110deg,#00000000,45%,#ffffff80,55%,#00000000)] bg-[length:200%_100%] animate-shimmer rounded-md" />}
                    <div className="flex items-start w-full ">
                      <div className={`"flex-grow w-full`}>

                        <h3 className="font-semibold text-lg text-gray-800">
                          <div className=" flex justify-between mb-3 w-full">
                            <Icon className={`w-6 h-6 ${selectedOffers.includes(offer.id) ? 'text-blue-600' : 'text-gray-600'}`} />
                            {index == 0 && <span className="border border-amber-600 rounded-full px-4 text-xs text-amber-600 py-0.5   flex items-center ">
                              Recommended
                            </span>}
                            {index == 1 && <span className="border border-violet-600 rounded-full px-4 text-xs text-violet-600 py-0.5  text-center flex items-center">
                              Popular Choice!
                            </span>}
                          </div>
                          <div>

                            {offer.name}
                          </div>
                        </h3>
                        <ul className="mt-2 space-y-1">
                          {offer.description.map((point, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-xs text-gray-600">{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="mt-3 flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-800">₹{offer.price}</span>
                      <button
                        onClick={() => toggleOffer(offer.id)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 relative overflow-hidden shadow-md ${selectedOffers.includes(offer.id)
                          ? 'bg-blue-600 !text-white'
                          : 'bg-white text-blue-600 border border-blue-600'
                          }`}
                      >

                        <span className="relative z-10">
                          {selectedOffers.includes(offer.id) ? 'Remove' : 'Add'}
                        </span>
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          <div className="p-6 border-t border-gray-200">
            <div className={`flex items-center ${freePage ? "justify-center" : "justify-between"}`}>
              {!freePage &&
                <span className="text-sm font-light text-gray-800 grid grid-cols-1">
                  <div className='grid grid-cols-2'><span className='font-semibold max-sm:text-xs' >Master Class:</span><span>&nbsp; ₹{basePrice}</span></div>
                  <div className='grid grid-cols-2'><span className='font-semibold max-sm:text-xs'>Add ons:  </span><span>&nbsp; ₹{totalPrice - basePrice} </span></div>
                  <div className='grid grid-cols-2'><span className='font-semibold max-sm:text-xs'>Total:  </span><span>&nbsp; ₹{totalPrice} </span></div>
                </span>
              }
              <button
                className="sm:px-6 px-3 py-2 max-sm:py-2 bg-green-500 !text-white rounded-lg font-bold text-lg shadow-lg transform transition-all duration-300 active:scale-105 relative overflow-hidden"
                onClick={() => {
                  mixpanel.track("mrkt_bump_modal", {
                    clicked: `pay_now`,
                    selectedOffers: `${selectedOffers.toString()}`
                  })
                  handleSubmit()
                }}
                disabled={loading}
              >
                {loading && <LoaderPinwheel className='animate-spin' />}
                {!loading && !freePage && <span className="relative z-10">Pay ₹{totalPrice}</span>}
                {!loading && freePage && (selectedOffers.length > 0 ? <span className="relative z-10">Pay ₹{totalPrice}</span> : <span className="relative z-10">Register Without Add-On</span>)}
              </button>
            </div>
          </div>
        </div>

      </div>}
    </div>
  )
}