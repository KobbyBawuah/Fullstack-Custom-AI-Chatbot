import type { NextApiRequest, NextApiResponse } from "next";

export default (req: NextApiRequest, res: NextApiResponse) => {
    try {
        throw new Error("API throw error test");
    } catch {
        res.status(200).json({ name: "John Doe" });
    }
};