import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Button, Input } from "../components";
import { updateUserProfile } from "../api/user.api";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../store/authSlice";

export default function UpdateProfile() {
    const {
        register,
        handleSubmit,
        formState: { isSubmitting },
    } = useForm();
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
        <div className="flex justify-center items-center min-h-[80vh] px-4">
            <div className="w-full max-w-md rounded-2xl border bg-white p-6 shadow-sm">

                {/* Header */}
                <h1 className="text-2xl font-semibold text-purple-600 mb-2">
                    Update Profile
                </h1>
                <p className="text-sm text-gray-500 mb-6">
                    Enter at least one field to update your profile.
                </p>

                {/* Form */}
                <form onSubmit={handleSubmit(submit)} className="space-y-4">

                    {/* Name */}
                    <Input
                        label="New Full Name"
                        placeholder="Enter new full name"
                        {...register("name")}
                    />

                    {/* Email */}
                    <Input
                        label="New Email"
                        placeholder="Enter new email"
                        type="email"
                        {...register("email")}
                    />

                    {/* Submit */}
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full rounded-xl bg-purple-600 py-2 text-white hover:bg-purple-700 transition"
                    >
                        {isSubmitting ? "Updating..." : "Update Profile"}
                    </Button>
                </form>
            </div>
        </div>
    );
}
