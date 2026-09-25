"use client"

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

interface SidebarLinkType {
    text: string,
    href: string,
    image?: string,
    games?: number
}

export default function SidebarLink({ text, href, image, games }: SidebarLinkType) {
    const isActive = usePathname() === href;

    return (
        <Link
            href={href}
            aria-current={isActive ? "page" : undefined}
            className={`flex items-center gap-2.5 h-10 px-2 rounded-nav text-sm
            ${isActive ? "bg-accent-tint text-ink font-semibold" : "text-ink-2 font-medium hover:bg-subtle hover:text-ink"}`}
        >
            {image && (
                // The name is already written next to it, so the logo is decorative (empty alt).
                <Image src={image} alt="" width={24} height={24} className="w-6 h-6 shrink-0 rounded-chip object-contain" />
            )}
            <span className="flex-1 min-w-0 truncate">{text}</span>
            {games !== undefined && (
                <span className="text-[13px] text-ink-3 tabular-nums">{games}</span>
            )}
        </Link>
    )
}
