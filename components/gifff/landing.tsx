import { ExpandableTile } from "../pages/infoTile";

export function Faq() {
  return (
    <div className="md:w-2/3 w-4/5 pb-24">
      <h2 className="text-[21px] md:text-3xl text-center md:mt-20 mt-10">
        Frequently Asked <span className="text-[#F70]">Questions</span>
      </h2>
      <div className=" w-14 h-1 bg-[#F70] mx-auto mt-1 mb-4" />
      <p className="text-center mb-6">
        India&apos;s top Experts with a verified PnL who excel not only in
        Trading but also in Mentoring new traders
      </p>
      <div className="w-full flex flex-col gap-5 items-center">
        {FAQ_Content.map((faq, ind) => (
          <ExpandableTile header={faq.question} key={ind}>
            {faq.answer}
          </ExpandableTile>
        ))}
      </div>
    </div>
  );
}

export function Footer({ ctaHandler }: { ctaHandler: () => void }) {
  return (
    <div className="fixed bottom-0 z-20 w-full flex justify-between items-center bg-white md:px-20 py-2  max-md:px-7 shadow-[0_35px_70px_-5px_rgba(0,0,0,0.4)]">
      <div>
        <div className="flex flex-col  items-center">
          <b className="text-[#FF7700] text-3xl animate-pulse  ">₹99</b>
          <div className="text-lg text-black relative font-bold">
            ₹1000
            <div className="w-14 h-[2px] bg-black absolute -rotate-12 top-3" />
          </div>
        </div>
      </div>
      <div>
        <button
          onClick={ctaHandler}
          className="bg-[#FF7700] py-3 px-4 text-white md:text-lg text-sm rounded-lg hover:scale-105"
        >
          Claim Your VIP pass{" "}
          <span className=" hidden md:block ml-2">at ₹99</span>
        </button>
      </div>
    </div>
  );
}

const FAQ_Content = [
  {
    question: "When is the festival scheduled to take place?",
    answer: "The GIFFF will take place from August 15th to August 18th.",
  },
  {
    question: "Are there any other fees that I’ll have to pay?",
    answer: "The entire 4-day event is priced at just ₹99.",
  },
  {
    question: "Can I invite my friends to the festival?",
    answer:
      "Yes, you can! Invite your friends and get a chance to win real Paytm cash up to ₹10,000 through our Refer and Earn program.",
  },
  {
    question: "How can I refer the GIFFF to anyone?",
    answer:
      "You will receive a link after registration and login. Share it with your mates and have them register.",
  },
  {
    question: "What topics will be covered during the event?",
    answer:
      "The event covers a wide range of topics, including swing trading, intraday trading, forex and commodity trading, and institutional trading techniques.",
  },
  {
    question: "Are there any prizes or rewards during the festival?",
    answer:
      "Absolutely! You can win Amazon vouchers, exciting merchandise, real Paytm cash, and even an iPhone 16.",
  },
  {
    question: "How can I track my referral progress and rewards?",
    answer:
      "You can track your referral progress and rewards on the festival’s referral leaderboard, which will be updated live during the event.",
  },
  {
    question: "How will the prizes and rewards be distributed?",
    answer:
      "Prizes and rewards will be distributed electronically to the winners' Paytm accounts or via other specified methods after the event.",
  },
  {
    question:
      "Are there any prerequisites or prior knowledge required to attend the festival?",
    answer:
      "No prior knowledge is required. The festival is designed to cater to both beginners and experienced traders, with sessions covering basic to advanced trading strategies.",
  },
  {
    question: "Will there be interactive Q&A sessions with the experts?",
    answer:
      "Yes, each session will include a Q&A segment where you can ask questions and get answers from the experts.",
  },
  {
    question: "Is there any age restriction to attend the festival?",
    answer:
      "There is no specific age restriction, but participants should have an interest in trading and financial markets.",
  },
];
