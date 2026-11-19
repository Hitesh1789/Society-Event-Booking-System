import { useForm } from "react-hook-form";
import { useState } from "react";
import { createSociety, getSocieties } from "../api/society.api";
import { useDispatch } from "react-redux";
import { clearSocieties, addSocieties } from "../store/societiesSlice";
import { toast } from "sonner";
import { Users, Type, FileText, KeyRound, Loader2, AlertCircle } from "lucide-react";

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

export default function CreateSociety() {
  const form = useForm({
    defaultValues: {
      name: "",
      description: "",
      join_code: "",
    },
  });
  const { isSubmitting } = form.formState;

  const [apiError, setApiError] = useState("");

  const dispatch = useDispatch();

  const submit = async (data) => {
    try {
      setApiError("");
      await createSociety(data);
      toast.success("Society created Successfully", {
        duration: 2000,
      });
      dispatch(clearSocieties());
      const socRes = await getSocieties();
      dispatch(addSocieties({ societies: socRes.data.data.societies }));
      form.reset(); // clear form on success
    } catch (error) {
      setApiError(
        error?.response?.data?.message || "Something went wrong. Try again."
      );
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-10">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-600 text-white shadow-md">
            <Users className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl font-bold">
            Create a Society
          </CardTitle>
          <CardDescription>
            Fill in the details below to create a new society.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* API Error */}
          {apiError && (
            <div className="mb-5 flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{apiError}</span>
            </div>
          )}

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(submit)}
              className="space-y-5"
            >
              {/* Society Name */}
              <FormField
                control={form.control}
                name="name"
                rules={{ required: "Society name is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Society Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Type className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          placeholder="Enter society name"
                          className="pl-10"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                rules={{ required: "Description is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <FileText className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          placeholder="Enter society description"
                          className="pl-10"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Join Code */}
              <FormField
                control={form.control}
                name="join_code"
                rules={{ required: "Join code is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Join Code</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          placeholder="Enter join code"
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
                    Creating...
                  </>
                ) : (
                  "Create Society"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}