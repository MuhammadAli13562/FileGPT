import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { SignUpFormValidation } from "../../validation/index";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSignUpUserMutation } from "src/redux/api/auth";
import { useVerificationOnMount } from "src/hooks/useVerificationOnMount";

const SignUpForm = () => {
  useVerificationOnMount();
  const [SignUp] = useSignUpUserMutation();
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof SignUpFormValidation>>({
    resolver: zodResolver(SignUpFormValidation),
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  });

  async function onSubmit(creds: z.infer<typeof SignUpFormValidation>) {
    try {
      const resp = await toast.promise(
        SignUp(creds).unwrap(),
        {
          pending: "Registering New User",
        },
        { position: "top-center" }
      );
      toast.success("Registration Successful");
      localStorage.setItem("token", resp.token);
      localStorage.setItem("email", creds.email);
      navigate("/chat/default");
    } catch (error: any) {
      error.status === 409
        ? toast.error("Email or Username Already taken")
        : toast.error("Registration Failed ! Try again.");
    }
  }
  return (
    <>
      <div className="col-center gap-2 mb-6">
        <span className="font-bold ">Create a new account</span>
        <span className="text-gray-400 ">To use this app enter your details</span>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 col-center">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input className="form-field" placeholder="Ali" {...field} />
                </FormControl>
                <FormDescription></FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input className="form-field" placeholder="a@a.com" {...field} />
                </FormControl>
                <FormDescription></FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input className="form-field" type="password" placeholder="*******" {...field} />
                </FormControl>
                <FormDescription></FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <button className="w-full primary-btn " type="submit">
            Sign Up
          </button>
          <div className="text-sm text-gray-400">
            <span>Already have an account ? </span>
            <Link to="/sign-in" className="form-links ">
              Sign In
            </Link>
          </div>
        </form>
      </Form>
    </>
  );
};

export default SignUpForm;
