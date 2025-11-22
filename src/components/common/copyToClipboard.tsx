"use client";

import { IoCopyOutline } from "react-icons/io5";
import { toast } from "sonner";

interface HandleCopyProps {
  text: string;
}

const HandleCopy: React.FC<HandleCopyProps> = ({ text }) => {
  const handleCopy = async (textToCopy: string) => {
    if (!textToCopy) {
      toast.error("No text to copy");
      return;
    }

    try {
      await navigator.clipboard.writeText(textToCopy);
      toast.success("Copied to clipboard!");
    } catch (err) {
      console.error("Copy failed:", err);
      toast.error("Failed to copy to clipboard");
    }
  };

  return (
    <span
      className='cursor-pointer hover:text-secondary transition-colors'
      onClick={() => handleCopy(text)}
      title='Copy to clipboard'>
      <IoCopyOutline size={15} />
    </span>
  );
};

export default HandleCopy;
