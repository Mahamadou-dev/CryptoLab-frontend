// Fichier : components/simulator-generic-asymmetric.tsx
"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, Play } from "lucide-react"
import { useTranslation } from "@/lib/i18n"
import { useLanguage } from "@/lib/language-context"
import {
    cryptoAPI,
    type AlgorithmOperation,
    type CryptoActionResult,
    type SimulationTrace,
} from "@/lib/api-client"

interface SimulatorGenericProps {
    setSimResult: (result: SimulationTrace | null) => void
    setFinalOutput: (result: CryptoActionResult | null) => void
    clearResults: () => void
    onSimulationStart: () => void
    onSimulationEnd: (result: SimulationTrace | null, output: CryptoActionResult | null) => void
    isSimulating: boolean
    /** Slug du registre (ex. "dsa", "elgamal") — decide quelle route appeler. */
    algoId: string
}

interface JsonSchemaProperty {
    type?: string
    title?: string
    default?: unknown
    maxLength?: number
    anyOf?: { type?: string }[]
}

interface JsonSchema {
    properties?: Record<string, JsonSchemaProperty>
    required?: string[]
}

/**
 * Simulateur générique pilote par le schéma JSON du catalogue.
 *
 * Les algorithmes clef publique ajoutés en Sprint 6 (RSA petits nombres,
 * signatures RSA/ECDSA/Ed25519/DSA, Diffie-Hellman, ECDH, ECC, ElGamal)
 * n'ont pas tous un composant `simulator-*.tsx` dédié écrit à la main.
 * Plutôt qu'en écrire un par algorithme, ce composant lit
 * `AlgorithmOperation.schema` (déjà servi par `/api/algorithms`, dérivé du
 * modèle Pydantic de chaque opération) et construit le formulaire à la
 * volée — exactement l'architecture visée par CLAUDE.md §5 : « ajouter un
 * algorithme = un fichier », côté backend, sans toucher au frontend.
 *
 * Le résultat brut est affiché tel quel (JSON) : ces opérations ne rendent
 * pas toutes une trace pas à pas structurée comme `/api/simulate/*`, un
 * formulaire entrée/sortie fonctionnel est la présentation la plus simple
 * cohérente avec ce que ces algorithmes exposent réellement aujourd'hui.
 */
export function SimulatorGenericAsymmetric({
    setSimResult: _setSimResult,
    setFinalOutput,
    clearResults,
    onSimulationStart,
    onSimulationEnd,
    isSimulating,
    algoId,
}: SimulatorGenericProps) {
    const { language } = useLanguage()
    const t = useTranslation(language)

    const [operations, setOperations] = useState<AlgorithmOperation[]>([])
    const [selected, setSelected] = useState<AlgorithmOperation | null>(null)
    const [values, setValues] = useState<Record<string, string>>({})
    const [loadError, setLoadError] = useState<string | null>(null)
    const [runError, setRunError] = useState<string | null>(null)

    useEffect(() => {
        let cancelled = false
        cryptoAPI
            .getAlgorithm(algoId)
            .then((detail) => {
                if (cancelled) return
                setOperations(detail.operations)
                setSelected(detail.operations[0] ?? null)
                setValues({})
            })
            .catch(() => {
                if (!cancelled) setLoadError(t("sim.generic.loadError"))
            })
        return () => {
            cancelled = true
        }
    }, [algoId, t])

    const schema = (selected?.schema ?? null) as JsonSchema | null
    const properties = schema?.properties ?? {}
    const required = new Set(schema?.required ?? [])

    function fieldType(prop: JsonSchemaProperty): "number" | "text" {
        const t0 = prop.type ?? prop.anyOf?.find((a) => a.type && a.type !== "null")?.type
        return t0 === "integer" || t0 === "number" ? "number" : "text"
    }

    function isLongField(prop: JsonSchemaProperty): boolean {
        return (prop.maxLength ?? 0) > 200
    }

    const handleSelectOperation = (op: AlgorithmOperation) => {
        setSelected(op)
        setValues({})
        setRunError(null)
    }

    const handleRun = async () => {
        if (!selected) return
        clearResults()
        setRunError(null)
        onSimulationStart()

        let apiResponse: CryptoActionResult | null = null
        try {
            const payload: Record<string, unknown> = {}
            for (const [key, prop] of Object.entries(properties)) {
                const raw = values[key]
                if (raw === undefined || raw === "") {
                    if (required.has(key)) {
                        throw new Error(t("sim.generic.missingField", { field: prop.title ?? key }))
                    }
                    continue
                }
                payload[key] = fieldType(prop) === "number" ? Number(raw) : raw
            }

            const response = await cryptoAPI.runOperation<CryptoActionResult>(
                selected.method,
                selected.path,
                payload,
            )
            apiResponse = response
            setFinalOutput(response)
        } catch (error) {
            setRunError(error instanceof Error ? error.message : t("sim.apiError"))
        }
        onSimulationEnd(null, apiResponse)
    }

    if (loadError) {
        return (
            <Alert variant="destructive">
                <AlertTitle>{t("sim.apiError")}</AlertTitle>
                <AlertDescription>{loadError}</AlertDescription>
            </Alert>
        )
    }

    if (!operations.length) {
        return <p className="text-sm text-foreground-secondary">{t("sim.loading")}</p>
    }

    return (
        <div className="space-y-6">
            {/* Sélecteur d'opération */}
            <div className="flex flex-wrap gap-2">
                {operations.map((op) => (
                    <Button
                        key={op.name}
                        type="button"
                        variant={selected?.name === op.name ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleSelectOperation(op)}
                        className="rounded-full"
                    >
                        {op.summary || op.name}
                    </Button>
                ))}
            </div>

            {/* Formulaire dérivé du schéma JSON */}
            {selected && Object.keys(properties).length > 0 && (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {Object.entries(properties).map(([key, prop]) => (
                        <div key={key} className="space-y-2">
                            <Label htmlFor={`generic-${key}`}>
                                {prop.title ?? key}
                                {required.has(key) && <span className="text-accent-secondary"> *</span>}
                            </Label>
                            {isLongField(prop) ? (
                                <Textarea
                                    id={`generic-${key}`}
                                    value={values[key] ?? ""}
                                    onChange={(e) => setValues((v) => ({ ...v, [key]: e.target.value }))}
                                    className="min-h-[120px] font-mono text-xs"
                                    disabled={isSimulating}
                                />
                            ) : (
                                <Input
                                    id={`generic-${key}`}
                                    type={fieldType(prop)}
                                    value={values[key] ?? ""}
                                    onChange={(e) => setValues((v) => ({ ...v, [key]: e.target.value }))}
                                    className="font-mono text-xs"
                                    disabled={isSimulating}
                                />
                            )}
                        </div>
                    ))}
                </div>
            )}

            {selected && Object.keys(properties).length === 0 && (
                <p className="text-sm text-foreground-secondary">{t("sim.generic.noFields")}</p>
            )}

            <Button onClick={handleRun} disabled={isSimulating || !selected} className="w-full gap-2">
                {isSimulating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                {selected ? selected.summary || selected.name : t("sim.generic.run")}
            </Button>

            {runError && (
                <Alert variant="destructive">
                    <AlertTitle>{t("sim.apiError")}</AlertTitle>
                    <AlertDescription className="break-all">{runError}</AlertDescription>
                </Alert>
            )}
        </div>
    )
}
