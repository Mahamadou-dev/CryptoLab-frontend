"use client"

import { Suspense, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { AlertCircle, Loader2, UserPlus } from "lucide-react"

import { AuthShell } from "@/components/auth/auth-shell"
import { Field } from "@/components/auth/field"
import { Button } from "@/components/ui/button"
import { AuthError, useAuth } from "@/lib/auth-context"
import { safeRedirect } from "@/lib/safe-redirect"

const MIN_PASSWORD = 10

export default function RegisterPage() {
    return (
        <Suspense fallback={null}>
            <RegisterForm />
        </Suspense>
    )
}

interface FormState {
    first_name: string
    last_name: string
    email: string
    country: string
    city: string
    password: string
    confirm: string
}

const EMPTY: FormState = {
    first_name: "",
    last_name: "",
    email: "",
    country: "",
    city: "",
    password: "",
    confirm: "",
}

function RegisterForm() {
    const router = useRouter()
    const params = useSearchParams()
    const { register } = useAuth()

    const [form, setForm] = useState<FormState>(EMPTY)
    const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof FormState, string>>>({})
    const [error, setError] = useState<string | null>(null)
    const [pending, setPending] = useState(false)

    const destination = safeRedirect(params.get("next"), "/learn")

    function update(key: keyof FormState) {
        return (event: React.ChangeEvent<HTMLInputElement>) => {
            setForm((current) => ({ ...current, [key]: event.target.value }))
            setFieldErrors((current) => ({ ...current, [key]: undefined }))
        }
    }

    /** Verifications locales : elles evitent un aller-retour reseau evident. */
    function validate(): boolean {
        const errors: Partial<Record<keyof FormState, string>> = {}

        if (!form.first_name.trim()) errors.first_name = "Prenom requis."
        if (!form.last_name.trim()) errors.last_name = "Nom requis."
        if (!form.email.includes("@")) errors.email = "Adresse e-mail invalide."
        if (form.country.trim().length < 2) errors.country = "Pays requis."
        if (!form.city.trim()) errors.city = "Ville requise."

        if (form.password.length < MIN_PASSWORD) {
            errors.password = `Au moins ${MIN_PASSWORD} caracteres.`
        } else if (new TextEncoder().encode(form.password).length > 72) {
            // Limite de bcrypt, cote serveur comme ici.
            errors.password = "Mot de passe trop long (72 octets maximum)."
        }

        if (form.confirm !== form.password) errors.confirm = "Les mots de passe different."

        setFieldErrors(errors)
        return Object.keys(errors).length === 0
    }

    async function onSubmit(event: React.FormEvent) {
        event.preventDefault()
        setError(null)
        if (!validate()) return

        setPending(true)
        try {
            await register({
                email: form.email.trim(),
                password: form.password,
                first_name: form.first_name.trim(),
                last_name: form.last_name.trim(),
                country: form.country.trim(),
                city: form.city.trim(),
            })
            router.replace(destination)
            router.refresh()
        } catch (cause) {
            if (cause instanceof AuthError && cause.status === 409) {
                setFieldErrors({ email: "Un compte existe deja pour cette adresse." })
            } else {
                setError(
                    cause instanceof AuthError
                        ? cause.message
                        : "Inscription impossible. Verifiez votre reseau et reessayez.",
                )
            }
            setPending(false)
        }
    }

    return (
        <AuthShell
            title="Creer un compte"
            subtitle="Le cours et le laboratoire sont reserves aux membres inscrits."
            footer={
                <>
                    Deja inscrit ?{" "}
                    <Link href="/login" className="text-[var(--color-secondary)] hover:underline">
                        Se connecter
                    </Link>
                </>
            }
        >
            <form onSubmit={onSubmit} className="space-y-4" noValidate>
                {error && (
                    <div
                        role="alert"
                        className="flex items-start gap-2 rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-300"
                    >
                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field
                        label="Prenom"
                        name="given-name"
                        autoComplete="given-name"
                        value={form.first_name}
                        onChange={update("first_name")}
                        error={fieldErrors.first_name}
                    />
                    <Field
                        label="Nom"
                        name="family-name"
                        autoComplete="family-name"
                        value={form.last_name}
                        onChange={update("last_name")}
                        error={fieldErrors.last_name}
                    />
                </div>

                <Field
                    label="Adresse e-mail"
                    type="email"
                    name="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={update("email")}
                    error={fieldErrors.email}
                />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field
                        label="Pays"
                        name="country"
                        autoComplete="country-name"
                        value={form.country}
                        onChange={update("country")}
                        error={fieldErrors.country}
                    />
                    <Field
                        label="Ville"
                        name="city"
                        autoComplete="address-level2"
                        value={form.city}
                        onChange={update("city")}
                        error={fieldErrors.city}
                    />
                </div>

                <Field
                    label="Mot de passe"
                    type="password"
                    name="new-password"
                    autoComplete="new-password"
                    value={form.password}
                    onChange={update("password")}
                    error={fieldErrors.password}
                    hint={`Au moins ${MIN_PASSWORD} caracteres. Une phrase de passe vaut mieux qu'un mot complique.`}
                />

                <Field
                    label="Confirmer le mot de passe"
                    type="password"
                    name="confirm-password"
                    autoComplete="new-password"
                    value={form.confirm}
                    onChange={update("confirm")}
                    error={fieldErrors.confirm}
                />

                <Button type="submit" className="btn-gemini w-full justify-center" disabled={pending}>
                    {pending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <UserPlus className="mr-2 h-4 w-4" />
                    )}
                    {pending ? "Creation..." : "Creer mon compte"}
                </Button>

                <p className="text-xs text-foreground-tertiary">
                    Votre mot de passe est hache avec bcrypt avant d&apos;etre stocke : personne, pas
                    meme l&apos;administrateur du site, ne peut le relire.
                </p>
            </form>
        </AuthShell>
    )
}
