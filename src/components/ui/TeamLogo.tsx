import Image from "next/image";

export default function TeamLogo({ src }: { src: string | null }) {
    return src
        ? <Image src={src} alt="" width={20} height={20} className="shrink-0 object-contain" />
        : <span className="shrink-0 w-5 h-5 rounded-chip bg-field" aria-hidden="true" />;
}