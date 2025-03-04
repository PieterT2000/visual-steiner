import Logo from "@/images/icons/logo_2.svg?react";
import SettingsIcon from "@/images/icons/settings.svg?react";
import QuestionIcon from "@/images/icons/question_mark.svg?react";
import LicenseIcon from "@/images/icons/license.svg?react";

const Navbar = () => {
  return (
    <div className="w-navbar h-screen p-4 flex flex-col justify-between items-center  border-r">
      <Logo />
      <div className="flex flex-col gap-4 text-active">
        <SettingsIcon />
        <QuestionIcon />
        <LicenseIcon />
      </div>
    </div>
  );
};

export default Navbar;
