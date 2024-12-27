import axios from "axios";

export const OTPProvider = {
  id: "otp",
  name: "OTP",
  type: "credentials",
  credentials: {
    phone: {
      label: "Phone Number",
      type: "text",
      placeholder: "Enter your phone",
    },
    otp: { label: "OTP", type: "text", placeholder: "Enter OTP" },
  },
  authorize: async (credentials: { phone: string; otp: string }) => {
    const { phone, otp } = credentials;

    if (!phone || !otp) {
      return null;
    }

    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_API}auth/verify-otp`,
        { params: { phone: `+91${phone.replaceAll("+91", "")}`, otp } }
      );

      if (data.data.type === "success") {
        const { data: userData } = await axios.post(
          `${process.env.NEXT_PUBLIC_BASE_API}auth/otpless-login`,
          {
            phone,
          }
        );
        const { data: user } = userData;
        return {
          id: user.id,
          name: user.name,
          email: user.email,
        };
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error during OTP verification:", error);
      return null;
    }
  },
};
