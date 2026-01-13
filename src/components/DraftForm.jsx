import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, Select } from "./index";
import { useSelector } from "react-redux";
import { createEventDraft } from "../api/eventDraft.api";
import { getUser } from "../api/user.api";
import { updateUser } from "../store/authSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
export default function DraftForm() {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm();

    const [apiError, setApiError] = useState("");
    const navigate = useNavigate();
    const userData = useSelector((state) => state.auth.userData);
    const mySocieties = userData?.societies.filter((s)=>s.society_role=='lead') || [];
    const parentDrafts = userData?.pendingDrafts || [];
    const dispatch = useDispatch();

    const createDraft = async (data) => {
        try {
            setApiError("");
            const {
                title, description, proposedDate, proposedLocation, societyId,parentDraftId
            } = data;

            const res = {
                title,
                description,
                proposedDate,
                proposedLocation,
                societyId : Number(societyId)
            }
            if(parentDraftId) res[parentDraftId] = Number(parentDraftId)
            await createEventDraft(res);
            const user = await getUser();
            dispatch(updateUser({newUserData:user.data.data}))
            navigate('/drafts')
        } catch (err) {
            setApiError(
                err?.response?.data?.message ||
                "Something went wrong while creating the draft"
            );
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[85vh] px-4 ">
            <div className="w-full max-w-lg rounded-2xl border bg-white p-8 shadow-md">

                {/* Header */}
                <h1 className="text-3xl font-bold text-purple-600 mb-2">
                    Create Event Draft
                </h1>
                <p className="text-sm text-gray-500 mb-6">
                    Submit an event idea for approval by selecting a society.
                </p>

                {/* API Error */}
                {apiError && (
                    <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                        {apiError}
                    </div>
                )}

                <form onSubmit={handleSubmit(createDraft)} className="space-y-5">

                    {/* Society */}
                    <Select
                        label="Select Society : "
                        options={mySocieties.map((s) => ({
                            label: s.society_name,
                            value: s.society_id,
                        }))}
                        {...register("societyId", { required: true })}
                    />
                    {errors.societyId && (
                        <p className="text-sm text-red-500">Society is required</p>
                    )}

                    {/* Title */}
                    <Input
                        label="Draft Title : "
                        placeholder="Enter event title"
                        {...register("title", { required: "Title is required" })}
                    />
                    {errors.title && (
                        <p className="text-sm text-red-500">{errors.title.message}</p>
                    )}

                    {/* Description */}
                    <Input
                        label="Description : "
                        placeholder="Brief event description"
                        {...register("description", { required: "Description is required" })}
                    />
                    {errors.description && (
                        <p className="text-sm text-red-500">{errors.description.message}</p>
                    )}

                    {/* Date */}
                    <Input
                        type="date"
                        label="Proposed Date : "
                        {...register("proposedDate", {
                            required: "Proposed date is required",
                        })}
                    />
                    {errors.proposedDate && (
                        <p className="text-sm text-red-500">
                            {errors.proposedDate.message}
                        </p>
                    )}

                    {/* Location */}
                    <Input
                        label="Proposed Location : "
                        placeholder="Eg: Main Auditorium"
                        {...register("proposedLocation", {
                            required: "Location is required",
                        })}
                    />
                    {errors.proposedLocation && (
                        <p className="text-sm text-red-500">
                            {errors.proposedLocation.message}
                        </p>
                    )}

                    {/* Parent Draft */}
                    {parentDrafts.length > 0 && (
                        <Select
                            label="Parent Draft : "
                            options={parentDrafts.map((d) => ({
                                label: d.title,
                                value: d.id,
                            }))}
                            {...register("parentDraftId", { required: "Description is required" })}
                        />
                    )}

                    {/* Submit */}
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full rounded-xl bg-purple-600 py-2 text-white hover:bg-purple-700 transition"
                    >
                        {isSubmitting ? "Creating Draft..." : "Create Draft"}
                    </Button>
                </form>
            </div>
        </div>
    );
}
