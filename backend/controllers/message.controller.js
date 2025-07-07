import Message from "../models/Message.model.js";

export const sendMessage = async (req, res) => {
    try {
        const { content, receiverId } = req.body;
        const newMessage = await Message.create({
            sender: req.user.id,
            receiver: receiverId,
            content
        })

        // TODO: send the message in real time => socket.io

        res.status(201).json({ message: newMessage });
    } catch (error) {
        console.log("Error in sendMessage controller: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getConversation = async (req, res) => {
    const { userId } = req.params;

    try {
        const messages = await Message.find({
            $or: [
                { sender: userId, receiver: req.user.id },
                { sender: req.user.id, receiver: userId }
            ]
        }).sort("createdAt")

        res.status(200).json({ messages });
    } catch (error) {
        console.log("Error in getConversation controller: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
}