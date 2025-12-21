"use server";

import { verifyCredentials, verifyPassword, setAuthCookie, clearAuthCookie, checkAuth, updatePassword, updateUsername } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function loginAction(username: string, password: string) {
  const isValid = await verifyCredentials(username, password);

  if (isValid) {
    await setAuthCookie();
    return { success: true };
  }

  return { success: false, error: "Неверный логин или пароль" };
}

export async function logoutAction() {
  await clearAuthCookie();
  redirect("/");
}

export async function changePasswordAction(currentPassword: string, newPassword: string) {
  const isAuthenticated = await checkAuth();
  if (!isAuthenticated) {
    redirect("/admin/login");
  }

  const isValid = await verifyPassword(currentPassword);
  if (!isValid) {
    return { success: false, error: "Неверный текущий пароль" };
  }

  if (!newPassword || newPassword.length < 6) {
    return { success: false, error: "Новый пароль должен быть не короче 6 символов" };
  }

  await updatePassword(newPassword);
  await setAuthCookie();

  return { success: true };
}

export async function changeUsernameAction(newUsername: string) {
  const isAuthenticated = await checkAuth();
  if (!isAuthenticated) {
    redirect("/admin/login");
  }

  if (!newUsername || newUsername.trim().length < 3) {
    return { success: false, error: "Логин должен быть не короче 3 символов" };
  }

  await updateUsername(newUsername.trim());
  await setAuthCookie();

  return { success: true };
}
