import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Button,Input } from "../components";
import { changeUserPassword } from "../api/user.api";

export default function ChangePassword() {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm();
    
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
        <div className="flex justify-center items-center min-h-[80vh] px-4">
            <div className="w-full max-w-md rounded-2xl border p-6 shadow-sm bg-white">
                <h1 className="text-2xl font-semibold text-purple-600 mb-4">
                    Update Password
                </h1>

                <p className="text-sm text-muted-foreground mb-6">
                    Fill in the password details for updating.
                </p>

                <form onSubmit={handleSubmit(submit)} className="space-y-4">
                    {/* Event Name */}
                    <div>
                        <Input
                            label="Old password"
                            placeholder="Enter old password"
                            {...register("oldpass", { required: "Old password is required" })}

                        />
                        {errors.oldpass && (
                            <p className="text-sm text-red-500 mt-1">
                                {errors.oldpass.message}
                            </p>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <Input
                            label="New Password"
                            placeholder="Enter new password"
                            {...register("newpass", {
                                required: "New Password is required",
                            })}
                        />
                        {errors.newpass && (
                            <p className="text-sm text-red-500 mt-1">
                                {errors.newpass.message}
                            </p>
                        )}
                    </div>


                    {/* Submit */}
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full rounded-xl bg-purple-600 hover:bg-purple-700 p-2 text-white-700"
                    >
                        {isSubmitting ? "Updating..." : "Update Password"}
                    </Button>
                </form>
            </div>
        </div>
    );
    
}