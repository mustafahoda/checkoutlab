import Cookies from "js-cookie";
import { useEffect } from "react";

const useMerchantInCookie = (
  defaultMerchantAccount: string,
  onUpdateMerchantAccount: any
) => {
  useEffect(() => {
    const merchantAccountCookie = Cookies.get("merchantAccount");
    let merchantAccount = null;

    if (!merchantAccountCookie) {
      Cookies.set("merchantAccount", defaultMerchantAccount, {
        expires: 365,
      });
      merchantAccount = defaultMerchantAccount;
    } else {
      merchantAccount = merchantAccountCookie;
    }

    onUpdateMerchantAccount(merchantAccount);
  }, []);
};

export default useMerchantInCookie;
