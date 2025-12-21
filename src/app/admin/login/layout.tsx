// Отдельный layout для страницы логина - не показывает sidebar и не проверяет авторизацию
export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}


