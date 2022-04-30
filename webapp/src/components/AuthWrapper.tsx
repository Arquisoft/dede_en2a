import { useNavigate } from "react-router-dom";

import { onSessionRestore } from "@inrupt/solid-client-authn-browser";

type AuthWrapperProps = {
  children: any;
};

export default function AuthWrapper({ children, ...props }: AuthWrapperProps) {
  const navigate = useNavigate();

  onSessionRestore((url) => {
    navigate(extractRelativeUrlFromAbsoluteUrl(url), { replace: true });
  });

  const extractRelativeUrlFromAbsoluteUrl = (url: string) => {
    return url.substring(new URL(url).origin.length);
  };

  return children;
}
