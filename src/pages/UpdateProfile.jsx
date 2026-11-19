import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { User, Mail, Loader2 } from "lucide-react";
import { updateUserProfile } from "../api/user.api";
import { updateUser } from "../store/authSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

export default function UpdateProfile() {
    const form = useForm({
        defaultValues: {
            name: "",
            email: "",
        },
    });
    const { isSubmitting } = form.formState;
    const userData = useSelector((state) => state.auth.userData);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const submit = async (data) => {
        if (!data.name && !data.email) {
            toast.error("Please enter Name or Email to update profile", {
                duration: 2000,
            });
            return;
        }

        try {
            const payload = {};
            if (data.name) payload.name = data.name;
            if (data.email) payload.email = data.email;

            const res = await updateUserProfile(payload);

            toast.success("Profile Updated Successfully", {
                duration: 2000,
            });

            const updatedUserData = {
                ...userData,
                profile: {
                    ...userData.profile,
                    name: res.data.data.user.name,
                    email: res.data.data.user.email,
                },
            };
            dispatch(updateUser({ newUserData: updatedUserData }));
            navigate("/dashboard");

        } catch (error) {
            console.error(error);
            toast.error(
                error?.response?.data?.message || "Something went wrong. Try again.",
                { duration: 2000 }
            );
        }
    };

    return (
        <div className="flex min-h-[80vh] items-center justify-center px-4 py-10">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="space-y-1 text-center">
                    <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-600 text-white shadow-md">
                        <User className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-2xl font-bold">
                        Update Profile
                    </CardTitle>
                    <CardDescription>
                        Enter at least one field to update your profile.
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(submit)}
                            className="space-y-5"
                        >
                            {/* Name */}
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>New Full Name</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                                <Input
                                                    placeholder="Enter new full name"
                                                    className="pl-10"
                                                    {...field}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Email */}
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>New Email</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                                <Input
                                                    type="email"
                                                    placeholder="Enter new email"
                                                    className="pl-10"
                                                    {...field}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Submit */}
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full cursor-pointer bg-purple-600 text-white hover:bg-purple-700"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Updating...
                                    </>
                                ) : (
                                    "Update Profile"
                                )}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}