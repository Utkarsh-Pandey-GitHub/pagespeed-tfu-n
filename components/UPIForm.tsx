import axios from "axios";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { Input } from "./form";

type Inputs = {
  name: string;
  email: string;
  phone: string;
};

export default function UPIForm() {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<Inputs>();

  const router = useRouter();

  const submitForm = (data: Inputs) => {
    const { name, email, phone } = data;

    if (name && email && phone) {
      axios
        .post(
          `${process.env.NEXT_PUBLIC_BASE_API}payments/payment-intent/upi`,
          {
            email,
            phone,
            name,
            bootcampId: router.query["bootcamp-id"],
            token: router.query["token"],
          }
        )
        .then((res) => {
          if (res.data.url) {
            window.location.href = res.data.url;
          } else {
            alert("something went wrong!");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <form onSubmit={handleSubmit(submitForm)} className="py-6">
      <div className="mb-3">
        <Input
          type="text"
          name="name"
          label="Name"
          placeholder="Enter your name"
          register={register}
          errors={errors}
          rules={{ required: true }}
        />
      </div>

      <div className="mb-3">
        <Input
          type="email"
          name="email"
          label="Email"
          placeholder="Enter your email"
          register={register}
          errors={errors}
          rules={{ required: true }}
        />
      </div>

      <div className="mb-3">
        <Input
          type="number"
          name="phone"
          label="Phone Number"
          placeholder="Enter your phone number"
          register={register}
          errors={errors}
          rules={{
            required: true,
            minLength: {
              value: 10,
              message: "Phone number should be 10 digits",
            },
            maxLength: {
              value: 10,
              message: "Phone number should be 10 digits",
            },
          }}
        />
      </div>

      <div>
        <button className="btn-block btn-pill mt-3 btn-dark" type="submit">
          Pay Using UPI
        </button>
      </div>
    </form>
  );
}
