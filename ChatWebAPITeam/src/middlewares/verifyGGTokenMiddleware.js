import admin from "../../firebaseAdmin";

const verifyGGTokenMiddleware = async (req, res, next) => {
  try {
    const { token } = req.body;
    await admin.auth().verifyIdToken(token);
    delete req.body.token
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized: Invalid token", error });
  }
};

export default verifyGGTokenMiddleware
