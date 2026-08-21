"use client"

import { useId } from "react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

/**
 * Champ de formulaire etiquete.
 *
 * L'etiquette est liee au champ par `id` genere : indispensable au lecteur
 * d'ecran, et c'est ce qui rend le libelle cliquable.
 */
export function Field({
    label,
    error,
    hint,
    className,
    ...props
}: React.ComponentProps<typeof Input> & {
    label: string
    error?: string
    hint?: string
}) {
    const id = useId()
    const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined

    return (
        <div className={cn("space-y-1.5", className)}>
            <Label htmlFor={id}>{label}</Label>
            <Input
                id={id}
                aria-invalid={Boolean(error)}
                aria-describedby={describedBy}
                className={cn(error && "border-danger/70 focus-visible:ring-danger/40")}
                {...props}
            />
            {error ? (
                <p id={`${id}-error`} className="text-xs text-danger">
                    {error}
                </p>
            ) : hint ? (
                <p id={`${id}-hint`} className="text-xs text-foreground-tertiary">
                    {hint}
                </p>
            ) : null}
        </div>
    )
}
