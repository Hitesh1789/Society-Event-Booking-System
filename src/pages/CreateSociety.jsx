import { useForm } from "react-hook-form";
import { useState } from "react";
import { Input, Button } from "../components";
import { createSociety, getSocieties } from "../api/society.api";
import { useDispatch } from "react-redux";
import { clearSocieties,addSocieties } from "../store/societiesSlice";
export default function CreateSociety() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  const [apiError, setApiError] = useState("");

  const dispatch = useDispatch();
  
  const submit = async (data) => {
    try {
      setApiError("");
      await createSociety(data);
      dispatch(clearSocieties());
      const socRes = await getSocieties();
      dispatch(addSocieties({ societies: socRes.data.data.societies}));
      reset(); // clear form on success
    } catch (error) {
      setApiError(
        error?.response?.data?.message || "Something went wrong. Try again."
      );
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] px-4">
      <div className="w-full max-w-md rounded-2xl border p-6 shadow-sm bg-white">
        <h1 className="text-2xl font-semibold text-purple-600 mb-4">
          Create a Society
        </h1>

        <p className="text-sm text-muted-foreground mb-6">
          Fill in the details below to create a new society.
        </p>

        {/* API Error */}
        {apiError && (
          <div className="mb-4 rounded-lg bg-red-50 text-red-600 text-sm p-3">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit(submit)} className="space-y-4">
          {/* Society Name */}
          <div>
            <Input
              label="Society Name"
              placeholder="Enter society name"
              {...register("name", { required: "Society name is required" })}
            />
            {errors.name && (
              <p className="text-sm text-red-500 mt-1">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <Input
              label="Description"
              placeholder="Enter society description"
              {...register("description", {
                required: "Description is required",
              })}
            />
            {errors.description && (
              <p className="text-sm text-red-500 mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Join Code */}
          <div>
            <Input
              label="Join Code"
              placeholder="Enter join code"
              {...register("join_code", {
                required: "Join code is required",
              })}
            />
            {errors.join_code && (
              <p className="text-sm text-red-500 mt-1">
                {errors.join_code.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-purple-600 hover:bg-purple-700 p-2 text-white-700"
          >
            {isSubmitting ? "Creating..." : "Create Society"}
          </Button>
        </form>
      </div>
    </div>
  );
}
