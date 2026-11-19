import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Lock, KeyRound, Eye, EyeOff, Loader2 } from "lucide-react";
import { changeUserPassword } from "../api/user.api";
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

export default function ChangePassword() {
    const form = useForm({
        defaultValues: {
            oldpass: "",
            newpass: "",
        },
    });
    const { isSubmitting } = form.formState;

    const [showOld, setShowOld] = useState(false);
    const [showNew, setShowNew] = useState(false);

    const navigate = useNavigate();

    const submit = async (data) => {
        try {
            await changeUserPassword(data);
            toast.success("Password Changed Successfully", {
                duration: 2000,
            });
            navigate('/dashboard')

        } catch (error) {
            toast.error(
                error?.response?.data?.message || "Something went wrong. Try again.", {
                duration: 2000
            })
        }
    };

    return (
        <div className="flex min-h-[80vh] items-center justify-center px-4 py-10">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="space-y-1 text-center">
                    <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-600 text-white shadow-md">
                        <KeyRound className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-2xl font-bold">
                        Update Password
                    </CardTitle>
                    <CardDescription>
                        Fill in the password details for updating.
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(submit)}
                            className="space-y-5"
                        >
                            {/* Old password */}
                            <FormField
                                control={form.control}
                                name="oldpass"
                                rules={{ required: "Old password is required" }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Old Password</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                                <Input
                                                    type={showOld ? "text" : "password"}
                                                    placeholder="Enter old password"
                                                    className="pl-10 pr-10"
                                                    {...field}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowOld((prev) => !prev)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                                                    aria-label={showOld ? "Hide password" : "Show password"}
                                                >
                                                    {showOld ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                </button>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* New password */}
                            <FormField
                                control={form.control}
                                name="newpass"
                                rules={{ required: "New Password is required" }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>New Password</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                                <Input
                                                    type={showNew ? "text" : "password"}
                                                    placeholder="Enter new password"
                                                    className="pl-10 pr-10"
                                                    {...field}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowNew((prev) => !prev)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                                                    aria-label={showNew ? "Hide password" : "Show password"}
                                                >
                                                    {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                </button>
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
                                    "Update Password"
                                )}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}