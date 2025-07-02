import User from "../models/User.model.js"

export const swipeRight = async (req, res) => {
    try {
        const { likedUserId } = req.params;
        const currentUser = await User.findById(req.user.id);
        const likedUser = await User.findById(likedUserId);

        if (!likedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!currentUser.likes.includes(likedUserId)) {
            currentUser.likes.push(likedUserId);
            await currentUser.save();

            // if the other user already liked us, it's a match, update both users
            if (likedUser.likes.includes(currentUser.id)) {
                currentUser.matches.push(likedUserId);
                likedUser.matches.push(currentUser.id);

                await Promise.all([await currentUser.save(), await likedUser.save()])

                // TODO: send notification if it is a match => socket.io
            }

            res.status(200).json({ user: currentUser });
        }
    } catch (error) {
        console.log("Error in swipeRight controller: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const swipeLeft = async (req, res) => {
    try {
        const { dislikedUserId } = req.params;
        const currentUser = await User.findById(req.user.id);

        if (!currentUser.dislikes.includes(dislikedUserId)) {
            currentUser.dislikes.push(dislikedUserId);
            await currentUser.save();
        }

        res.status(200).json({ user: currentUser });
    } catch (error) {
        console.log("Error in swipeLeft controller: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getMatches = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate("matches", "name image");

        res.status(200).json({ matches: user.matches });
    } catch (error) {
        console.log("Error in getMatches controller: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getUserProfiles = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user.id);
        const users = await User.find({
            $and: [
                { _id: { $ne: currentUser._id } },
                { _id: { $nin: currentUser.likes } },
                { _id: { $nin: currentUser.dislikes } },
                { _id: { $nin: currentUser.matches } },
                {
                    gender: currentUser.genderPreference === "both"
                        ? { $in: ["male", "female"] }
                        : currentUser.genderPreference
                },
                { genderPreference: { $in: [currentUser.gender, "both"] } }
            ]
        });

        res.status(200).json({ users });
    } catch (error) {
        console.log("Error in getUserProfiles controller: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
}