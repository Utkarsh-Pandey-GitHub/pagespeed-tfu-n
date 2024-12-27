import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import webengage from "@/webengage";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import {
  Facebook,
  Instagram,
  Link,
  Linkedin,
  Twitter,
  X,
  Youtube,
} from "lucide-react";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { z } from "zod";

interface SocialLink {
  id: string;
  value: string;
}

const socialLinks = [
  { domain: "x.com", icon: Twitter },
  { domain: "twitter.com", icon: Twitter },
  { domain: "facebook.com", icon: Facebook },
  { domain: "linkedin.com", icon: Linkedin },
  { domain: "instagram.com", icon: Instagram },
  { domain: "youtube.com", icon: Youtube },
];

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  mobile: z
    .string()
    .min(10, "Invalid mobile number")
    .max(10, "Invalid mobile number")
    .regex(/^[6-9]\d{9}$/, "Invalid mobile number"),
  topic: z.string().min(1, "Topic is required"),
  socialLinks: z.string(),
});

const BecomeInstructorForm = () => {
  const [inputs, setInputs] = React.useState<SocialLink[]>([
    { id: generateId(), value: "" },
  ]);
  const inputRef = React.useRef<HTMLInputElement[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      mobile: "",
      topic: "",
      socialLinks: "",
    },
  });

  function generateId() {
    return Math.random().toString(36).substr(2, 9);
  }

  const handleRemoveInput = (id: string) => {
    setInputs(inputs.filter((input) => input.id !== id));
  };

  const handleInputChange = (id: string, value: string) => {
    setInputs(
      inputs.map((input) => (input.id === id ? { ...input, value } : input))
    );

    if (value.length === 0 && inputs.length > 1) {
      handleRemoveInput(id);
    }
  };

  // For adding new social input field
  useEffect(() => {
    const lastInput = inputs[inputs.length - 1];
    if (
      lastInput.value.length > 0 &&
      inputs.every((input) => input.value.length > 0)
    ) {
      setInputs((prevInputs) => [
        ...prevInputs,
        { id: generateId(), value: "" },
      ]);
    }
  }, [inputs]);

  const submitForm = async (values: z.infer<typeof formSchema>) => {
    const _webengage = webengage();
    if (_webengage) {
      _webengage.user.login(values.mobile);
      _webengage.user.setAttribute("we_email", values.email);
      _webengage.user.setAttribute("we_phone", values.mobile);
      _webengage.user.setAttribute("we_first_name", values.name);
      _webengage.track("Instructor Registered", {
        source: "Tradewise",
      });
    }
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("email", values.email);
    formData.append("mobile", values.mobile);
    formData.append("topic", values.topic);
    formData.append(
      "socialLinks",
      inputs.map((input) => input.value).join(",")
    );
    formData.append("source", "TradeWise");

    try {
      await axios.post(process.env.NEXT_PUBLIC_GOOGLE_SHEET_LINK!, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("We'll get back to you soon!");
    } catch (error) {
      console.error(error);
      toast.error("An error occurred. Please try again later.");
    } finally {
      form.reset();
      setInputs([{ id: generateId(), value: "" }]);
    }
  };

  const isLoading = form.formState.isSubmitting;

  return (
    <section className="w-full mt-8 relative container my-16 md:my-24">
      <h3 className="text-foreground text-center text-xl md:text-3xl lg:text-[40px] font-bold">
        Become an instructor today
      </h3>
      <h4 className="text-[#002082] md:text-foreground md:text-[28px] mt-3 md:my-6 text-center font-semibold">
        Please enter your details
      </h4>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(submitForm)}
          className="mt-8 font-sans"
        >
          <div className="space-y-6 mx-auto max-w-sm md:max-w-[700px]">
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="!capitalize">
                    Full Name <sup className="text-red-500">*</sup>
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="!ring-0 !outline-none"
                      disabled={isLoading}
                      {...field}
                      type="text"
                      placeholder="Enter your name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="!capitalize">
                    Email <sup className="text-red-500">*</sup>
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="!ring-0 !outline-none"
                      disabled={isLoading}
                      {...field}
                      type="text"
                      placeholder="Enter your email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="mobile"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="!capitalize">
                    Mobile Number <sup className="text-red-500">*</sup>
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="!ring-0 !outline-none"
                      disabled={isLoading}
                      {...field}
                      type="text"
                      placeholder="Enter your mobile number"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="topic"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="!capitalize">
                    Topic you want to teach{" "}
                    <sup className="text-red-500">*</sup>
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="!ring-0 !outline-none"
                      disabled={isLoading}
                      {...field}
                      type="text"
                      placeholder="Select topic of your choice"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="text-sm font-medium text-[#475569]">
              Social Media
              {inputs.map((input, index) => {
                const Icon =
                  socialLinks.find(({ domain }) => input.value.includes(domain))
                    ?.icon || Link;
                return (
                  <div
                    key={input.id}
                    className="flex items-center space-x-2 gap-[0.7px] border rounded-md overflow-hidden relative h-10 mt-1 mb-3"
                  >
                    {input.value.length > 0 && (
                      <button
                        disabled={isLoading}
                        value={input.value}
                        type="submit"
                        className="pointer-events-none h-full py-2 px-3 border-none bg-zinc-200 rounded-none cursor-default"
                      >
                        <Icon size={16} />
                      </button>
                    )}
                    <Input
                      ref={(el) => (inputRef.current[index] = el!)}
                      value={input.value}
                      onChange={(e) =>
                        handleInputChange(input.id, e.target.value)
                      }
                      placeholder="Enter your social link"
                      disabled={isLoading}
                      className="border-none active:border-none focus:border-none focus-visible:ring-0"
                    />
                    {input.value.length > 0 && (
                      <button
                        disabled={isLoading}
                        onClick={() => handleRemoveInput(input.id)}
                        type="button"
                        className="h-full py-2 px-3 border-none rounded-none bg-zinc-200"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <Button
            disabled={isLoading}
            type="submit"
            className="max-md:w-full md:w-[700px] gap-2 py-4 mt-7 block mx-auto font-semibold active:text-white hover:text-white focus:text-white rounded-md !h-auto text-lg"
          >
            {isLoading ? "Registering" : "Register now"}
          </Button>
        </form>
      </Form>
    </section>
  );
};

export default BecomeInstructorForm;
