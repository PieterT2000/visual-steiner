import { useState } from "react";
import Logo from "@/images/icons/logo_2.svg?react";
// import SettingsIcon from "@/images/icons/settings.svg?react";
import QuestionIcon from "@/images/icons/question_mark.svg?react";
import LicenseIcon from "@/images/icons/license.svg?react";
import LicenseDialog from "./LicenseDialog";
import UserManualDialog from "./UserManualDialog";

const Navbar = () => {
  const [licenseDialogOpen, setLicenseDialogOpen] = useState(false);
  const [userManualDialogOpen, setUserManualDialogOpen] = useState(false);

  return (
    <>
      <div className="w-navbar h-screen p-4 flex flex-col justify-between items-center border-r">
        <Logo />
        <div className="flex flex-col gap-4 text-active">
          {/* <SettingsIcon /> */}
          <div
            className="cursor-pointer hover:text-primary transition-colors"
            onClick={() => setUserManualDialogOpen(true)}
          >
            <QuestionIcon />
          </div>
          <div
            className="cursor-pointer hover:text-primary transition-colors"
            onClick={() => setLicenseDialogOpen(true)}
          >
            <LicenseIcon />
          </div>
        </div>
      </div>

      <LicenseDialog
        open={licenseDialogOpen}
        onOpenChange={setLicenseDialogOpen}
      />

      <UserManualDialog
        open={userManualDialogOpen}
        onOpenChange={setUserManualDialogOpen}
      />
    </>
  );
};

export default Navbar;
