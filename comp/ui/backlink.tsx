import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import React from 'react';

interface BackLinkProps {
  href: string;
  label: string;
}

const BackLink: React.FC<BackLinkProps> = ({ href, label }) => {
  return (
    <Link href={href} className="flex items-center gap-1 link">
      <ArrowLeftIcon className="h-4 w-4" />
      {label}
    </Link>
  );
};

export default BackLink;