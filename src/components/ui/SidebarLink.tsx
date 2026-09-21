import Link from "next/link";

interface SidebarLinkType {
    text: string,
    href: string,
    image?: string,
    games?: number
}

export default function SidebarLink({ text, href, image, games }: SidebarLinkType) {
    const isActive = false;
    return (
        <Link href={href} className={`py-2 rounded-nav font-medium flex justify-start items-center mt-5 ${isActive ? 'text-accent bg-accent-tint' : 'text-ink-2'}`}>
            <img src={image} alt={text} className="w-8 mr-5" />
            <span className="flex-1 ml-4">{text}</span>
            <span className="justify-self-end">{games}</span>
        </Link>
    )
}