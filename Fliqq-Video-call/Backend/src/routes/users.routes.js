import { Router } from "express";
import { addToHistory, getUserHistory, login, register, googleAuth, getUserDetails, updateUserDetails, checkUser, resetPassword } from "../controllers/user.controller.js";

const router = Router();
router.route("/login").post(login);
router.route("/register").post(register)
router.route("/add_to_activity").post(addToHistory)
router.route("/get_all_activity").get(getUserHistory)
router.route("/oauth").post(googleAuth)
router.route("/get_user_details").get(getUserDetails)
router.route("/update_user_details").post(updateUserDetails)
router.route("/check_user").get(checkUser)
router.route("/reset_password").post(resetPassword)

export default router;
