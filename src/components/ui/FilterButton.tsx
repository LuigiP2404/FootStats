import Link from "next/link";

export default function FilterButton({ text, isActive, href }: { text: string, isActive?: boolean, href: string }) {
    return (
        <Link href={href} className={`text-sm px-4 py-2 rounded-nav font-bold ${isActive ? 'bg-surface text-ink' : 'text-ink-2'}`}>
            {text}
        </Link>   
    )
}