import { Router } from "express";
import { getProfileCv } from "../controllers/profileCv.controller.js";

const router = Router();

router.get("/", getProfileCv);

export default router;
