"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LogIn, LogOut, MapPin, User as UserIcon } from "lucide-react"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/lib/auth-context"
import { cn } from "@/lib/utils"

/** Etat de session dans la barre de navigation : connexion ou menu du compte. */
export function UserMenu() {
    const { user, loading, logout } = useAuth()
    const router = useRouter()
    const pathname = usePathname()

    if (loading) {
        // Reserve la place du bouton pour eviter que la barre ne sursaute une
        // fois la session verifiee.
        return <div aria-hidden className="h-9 w-9 rounded-full bg-[var(--surface)]" />
    }

    if (!user) {
        return (
            <Link
                href={`/login?next=${encodeURIComponent(pathname)}`}
                className={cn(
                    "flex items-center gap-2 rounded-lg px-3 py-2 text-sm",
                    "border border-[var(--border-color)] hover:bg-[var(--surface-hover)] transition-colors",
                )}
            >
                <LogIn className="h-4 w-4" />
                <span className="hidden sm:inline">Connexion</span>
            </Link>
        )
    }

    const initials = `${user.first_name[0] ?? ""}${user.last_name[0] ?? ""}`.toUpperCase()

    async function onLogout() {
        await logout()
        router.push("/")
        router.refresh()
    }

    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger
                aria-label="Menu du compte"
                className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full",
                    "bg-[var(--gradient-primary)] bg-[var(--color-primary)] text-white",
                    "text-xs font-bold ring-1 ring-[var(--border-color)]",
                )}
            >
                {initials || <UserIcon className="h-4 w-4" />}
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-60">
                <DropdownMenuLabel className="font-normal">
                    <p className="font-semibold">
                        {user.first_name} {user.last_name}
                    </p>
                    <p className="truncate text-xs text-foreground-secondary">{user.email}</p>
                    <p className="mt-1 flex items-center gap-1 text-xs text-foreground-tertiary">
                        <MapPin className="h-3 w-3" />
                        {user.city}, {user.country}
                    </p>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuItem asChild>
                    <Link href="/learn">Reprendre le cours</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href="/simulations">Ouvrir le laboratoire</Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem onSelect={() => void onLogout()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Se deconnecter
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
