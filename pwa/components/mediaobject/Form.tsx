import { FunctionComponent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ErrorMessage, Formik } from "formik";
import { useMutation } from "react-query";

import { fetch, FetchError, FetchResponse } from "../../utils/dataAccess";
import { MediaObject } from "../../types/MediaObject";

interface Props {
  mediaobject?: MediaObject;
}

interface SaveParams {
  values: MediaObject;
}

interface DeleteParams {
  id: string;
}

const saveMediaObject = async ({ values }: SaveParams) =>
  await fetch<MediaObject>(!values["@id"] ? "/media_objects" : values["@id"], {
    method: !values["@id"] ? "POST" : "PUT",
    body: JSON.stringify(values),
  });

const deleteMediaObject = async (id: string) =>
  await fetch<MediaObject>(id, { method: "DELETE" });

export const Form: FunctionComponent<Props> = ({ mediaobject }) => {
  const [, setError] = useState<string | null>(null);
  const router = useRouter();

  const saveMutation = useMutation<
    FetchResponse<MediaObject> | undefined,
    Error | FetchError,
    SaveParams
  >((saveParams) => saveMediaObject(saveParams));

  const deleteMutation = useMutation<
    FetchResponse<MediaObject> | undefined,
    Error | FetchError,
    DeleteParams
  >(({ id }) => deleteMediaObject(id), {
    onSuccess: () => {
      router.push("/mediaobjects");
    },
    onError: (error) => {
      setError(`Error when deleting the resource: ${error}`);
      console.error(error);
    },
  });

  const handleDelete = () => {
    if (!mediaobject || !mediaobject["@id"]) return;
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    deleteMutation.mutate({ id: mediaobject["@id"] });
  };

  return (
    <div className="container mx-auto px-4 max-w-2xl mt-4">
      <Link
        href="/mediaobjects"
        className="text-sm text-cyan-500 font-bold hover:text-cyan-700"
      >
        {`< Back to list`}
      </Link>
      <h1 className="text-3xl my-2">
        {mediaobject
          ? `Edit MediaObject ${mediaobject["@id"]}`
          : `Create MediaObject`}
      </h1>
      <Formik
        initialValues={
          mediaobject
            ? {
                ...mediaobject,
              }
            : new MediaObject()
        }
        validate={() => {
          const errors = {};
          // add your validation logic here
          return errors;
        }}
        onSubmit={(values, { setSubmitting, setStatus, setErrors }) => {
          const isCreation = !values["@id"];
          saveMutation.mutate(
            { values },
            {
              onSuccess: () => {
                setStatus({
                  isValid: true,
                  msg: `Element ${isCreation ? "created" : "updated"}.`,
                });
                router.push("/media_objects");
              },
              onError: (error) => {
                setStatus({
                  isValid: false,
                  msg: `${error.message}`,
                });
                if ("fields" in error) {
                  setErrors(error.fields);
                }
              },
              onSettled: () => {
                setSubmitting(false);
              },
            }
          );
        }}
      >
        {({
          values,
          status,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
        }) => (
          <form className="shadow-md p-4" onSubmit={handleSubmit}>
            <div className="mb-2">
              <label
                className="text-gray-700 block text-sm font-bold"
                htmlFor="mediaobject_contentUrl"
              >
                contentUrl
              </label>
              <input
                name="contentUrl"
                id="mediaobject_contentUrl"
                value={values.contentUrl ?? ""}
                type="text"
                placeholder=""
                className={`mt-1 block w-full ${
                  errors.contentUrl && touched.contentUrl
                    ? "border-red-500"
                    : ""
                }`}
                aria-invalid={
                  errors.contentUrl && touched.contentUrl ? "true" : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="text-xs text-red-500 pt-1"
                component="div"
                name="contentUrl"
              />
            </div>
            {status && status.msg && (
              <div
                className={`border px-4 py-3 my-4 rounded ${
                  status.isValid
                    ? "text-cyan-700 border-cyan-500 bg-cyan-200/50"
                    : "text-red-700 border-red-400 bg-red-100"
                }`}
                role="alert"
              >
                {status.msg}
              </div>
            )}
            <button
              type="submit"
              className="inline-block mt-2 bg-cyan-500 hover:bg-cyan-700 text-sm text-white font-bold py-2 px-4 rounded"
              disabled={isSubmitting}
            >
              Submit
            </button>
          </form>
        )}
      </Formik>
      <div className="flex space-x-2 mt-4 justify-end">
        {mediaobject && (
          <button
            className="inline-block mt-2 border-2 border-red-400 hover:border-red-700 hover:text-red-700 text-sm text-red-400 font-bold py-2 px-4 rounded"
            onClick={handleDelete}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};
