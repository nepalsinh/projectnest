import 'react-toastify/dist/ReactToastify.css';
import { RouterProvider } from 'react-router-dom'
import { router } from './utils/router'
import { Toaster } from 'sonner';
import { useTheme } from 'next-themes';
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";

TimeAgo.addDefaultLocale(en);

function App() {
  const { theme } = useTheme();
  let themeOrg: "dark" | "light" | "system" | undefined = "dark";
  if (theme) {
    if (["light", "dark", "system"].includes(theme)) {
      themeOrg = theme as "dark" | "light" | "system" | undefined;
    }
  }

  return (
    <>
      <Toaster
        richColors
        closeButton
        position="top-right"
        theme={themeOrg}
      />
      <RouterProvider router={router} />
    </>
  );
}
export default App;
