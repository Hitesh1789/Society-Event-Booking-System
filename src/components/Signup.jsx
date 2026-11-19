import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Calendar, User, Mail, Lock, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";

import { login as authLogin } from "../store/authSlice";
import { getUser, signupUser } from "../api/user.api";

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "../components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../components/ui/form";

function Signup() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const form = useForm({
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    });

    const { isSubmitting } = form.formState;

    const signup = async (data) => {
        setError("");
        try {
            const res = await signupUser(data);
            // console.log("SIGNUP:\n",res)
            if (res) {
                const userData = await getUser();
                // console.log("UserData:\n",userData)
                if (userData) dispatch(authLogin({ userData: userData.data.user }));
                // console.log(userData.data.data)
                navigate("/dashboard");
            }
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="flex w-full items-center justify-center py-10">
            <div className="w-full max-w-md">

                <Card className="shadow-lg">
                    <CardHeader className="space-y-1 text-center">
                        <CardTitle className="text-purple-600 text-2xl font-bold">
                            Create your account
                        </CardTitle>
                        <CardDescription>
                            Sign up to get started with EventMitra
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        {error && (
                            <div className="mb-5 flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(signup)}
                                className="space-y-5"
                            >
                                <FormField
                                    control={form.control}
                                    name="name"
                                    rules={{ required: "Full name is required" }}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Full Name</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                                    <Input
                                                        placeholder="Enter your full name"
                                                        className="pl-10"
                                                        {...field}
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="email"
                                    rules={{
                                        required: "Email is required",
                                        validate: {
                                            matchPattern: (value) =>
                                                /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                                                "Email address must be valid address",
                                        },
                                    }}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                                    <Input
                                                        type="email"
                                                        placeholder="you@example.com"
                                                        className="pl-10"
                                                        {...field}
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="password"
                                    rules={{ required: "Password is required" }}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                                    <Input
                                                        type={showPassword ? "text" : "password"}
                                                        placeholder="Enter your password"
                                                        className="pl-10 pr-10"
                                                        {...field}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPassword((prev) => !prev)}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                                    >
                                                        {showPassword ? (
                                                            <EyeOff className="h-4 w-4" />
                                                        ) : (
                                                            <Eye className="h-4 w-4" />
                                                        )}
                                                    </button>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full text-white bg-purple-600 cursor-pointer"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Creating account...
                                        </>
                                    ) : (
                                        "Create Account"
                                    )}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>

                    <CardFooter className="justify-center border-t pt-6">
                        <p className="text-sm text-muted-foreground">
                            Already have an account?{" "}
                            <Link
                                to="/login"
                                className="font-medium text-primary hover:underline"
                            >
                                Sign In
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}

export default Signup;