import Link from "next/link";

interface HeaderLinkType {
    text: string,
    href: string
}

export default function HeaderLink({ text, href }: HeaderLinkType) {
    const isActive = false;
    return (
        <Link href={href} className={`py-2 px-3.5 rounded-nav font-medium ${isActive ? 'text-accent bg-accent-tint' : 'text-ink-2'}`}>{text}</Link>
    )
}