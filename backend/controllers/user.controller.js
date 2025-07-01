import cloudinary from "../config/cloudinary.js";
import User from "../models/User.model.js";

export const updateProfile = async (req, res) => {
    // image => cloudinary => image.cloudinary.your => mongodb

    try {
        const { image, ...otherData } = req.body;

        let updatedData = otherData;

        if (image) {
            // base64 format
            if (image.startsWith("data:image")) {
                try {
                    const uploadResponse = await cloudinary.uploader.upload(image);

                    updatedData.image = uploadResponse.secure_url
                } catch (error) {
                    console.error("Error uploading image: ", uploadError);
                    return res.status(400).json({ message: "Error uploading image." });
                }
            }
        }

        const updatedUser = await User.findByIdAndUpdate(req.user.id, updatedData, { new: true });

        res.status(200).json({ user: updatedUser });
    } catch (error) {
        console.log("Error in updateProfile controller: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
}