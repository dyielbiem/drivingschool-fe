"use server";

const adminPutS3Image = async (preSignedURL, formData) => {
  try {
    const image = formData.get("image");
    const response = await fetch(preSignedURL, {
      method: "PUT",
      body: image,
      headers: {
        "Content-Type": image.type
      }
    });

    if (!response.ok) throw Error("An error occured");
    return { ok: true };
  } catch (error) {
    return { ok: false, json: { error: error.message } };
  }
};

export default adminPutS3Image;
