"use server";

import { verifyPassword, setAuthCookie, clearAuthCookie, checkAuth, updatePassword } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function loginAction(password: string) {
  const isValid = await verifyPassword(password);

  if (isValid) {
    await setAuthCookie();
    return { success: true };
  }

  return { success: false, error: "Неверный пароль" };
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
