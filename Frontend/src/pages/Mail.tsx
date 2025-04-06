import React from 'react';
import Cookies from 'js-cookie';
import {Mail} from '@/components/mail'; // Adjust the import path as needed
import { accounts, mails } from '@/data/data'; // Adjust the import path as needed

const MailPage = () => {
  // Retrieve cookie values using js-cookie
  const layoutCookie = Cookies.get("react-resizable-panels:layout:mail");
  const collapsedCookie = Cookies.get("react-resizable-panels:collapsed");

  let defaultLayout;
  let defaultCollapsed;

  // Parse the cookie values if they exist
  try {
    defaultLayout = layoutCookie ? JSON.parse(layoutCookie) : undefined;
    defaultCollapsed = collapsedCookie ? JSON.parse(collapsedCookie) : undefined;
  } catch (error) {
    console.error("Error parsing cookies:", error);
  }

  return (
    <>
      <div className="md:hidden">
        <img
          src="/examples/mail-dark.png"
          width="1280"
          height="727"
          alt="Mail"
          className="hidden dark:block"
        />
        <img
          src="/examples/mail-light.png"
          width="1280"
          height="727"
          alt="Mail"
          className="block dark:hidden"
        />
      </div>
      <div className="hidden flex-col md:flex">
        <Mail
          accounts={accounts}
          mails={mails}
          defaultLayout={defaultLayout}
          defaultCollapsed={defaultCollapsed}
          navCollapsedSize={4}
        />
      </div>
    </>
  );
};

export default MailPage;
