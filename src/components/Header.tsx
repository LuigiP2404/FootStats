import Image from 'next/image'
import logo from '../assets/footstats-logo.png'
import HeaderLink from './ui/HeaderLink'
import ThemeSwitcher from './ui/ThemeSwitcher'
import Search from './ui/HeaderSearch'

export default function Header() {
    return (
        <header className="header bg-surface flex items-center px-10 py-2 gap-6 border-b border-line">
            <div className="w-40">
                <Image src={logo} alt="logo" />
            </div>
            <div className="flex flex-1 gap-2.5">
                <HeaderLink text="Matches" href="#" />
                <HeaderLink text="Competitions" href="#" />
                <HeaderLink text="Favorites" href="#" />
                <HeaderLink text="Compare" href="#" />
            </div>
            <div className="flex gap-20">
                <Search />
                <ThemeSwitcher />
            </div>
        </header>
    )
}