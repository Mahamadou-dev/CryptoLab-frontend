"use client"

import { Navigation } from "@/components/navigation"
import React, { useState } from "react"
import { usePathname } from "next/navigation"
import { algorithms } from "@/lib/algorithms"
import { AlgorithmInfoCard } from "@/components/algorithm-info-card"
import { useLanguage } from "@/lib/language-context"
import { useTranslation } from "@/lib/i18n"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    CheckCircle2,
    ChevronRight,
    ChevronsRight,
    FileText,
    Key,
    Play,
    Square,
    RotateCcw,
    Zap,
    Info,
    Layers,
    Palette,
    Expand,
    X,
} from "lucide-react"

// --- IMPORTATION DES VRAIS SIMULATEURS ---
import { SimulatorCaesar } from "@/components/simulator-caesar"
import { SimulatorVigenere } from "@/components/simulator-vigenere"
import { SimulatorPlayfair } from "@/components/simulator-playfair"
import { SimulatorHash } from "@/components/simulator-hash"
import { SimulatorDes } from "@/components/simulator-des"
import { SimulatorAes } from "@/components/simulator-aes"
import { SimulatorRsa } from "@/components/simulator-rsa"
import {SimulatorRailfence} from "@/components/simulator-railfence";

// --- IMPORTATION DES VRAIES VISUALISATIONS 3D ---
import { DataCube } from "@/components/3d/data-cube"
import { CaesarViz } from "@/components/3d/caesar-viz"
import { VigenereViz } from "@/components/3d/vigenere-viz"
// @ts-ignore
import { PlayfairViz } from "@/components/3d/playfair-viz"
// @ts-ignore
import { DesViz } from "@/components/3d/des-viz"
import {RailFenceViz} from "@/components/3d/railfence-viz";


// --- CARTES DE ROUTAGE ---
// ... (Logique inchangée) ...
const simulatorMap: Record<string, React.ComponentType<any>> = {
    caesar: SimulatorCaesar,
    vigenere: SimulatorVigenere,
    playfair: SimulatorPlayfair,
    railfence: SimulatorRailfence,
    sha256: (props: any) => <SimulatorHash {...props} algoId="sha256" />,
    bcrypt: (props: any) => <SimulatorHash {...props} algoId="bcrypt" />,
    des: SimulatorDes,
    aes: SimulatorAes,
    rsa: SimulatorRsa,

}

const vizMap: Record<string, React.ComponentType<any>> = {
    caesar: CaesarViz,
    vigenere: VigenereViz,
    playfair: PlayfairViz,
    railfence: RailFenceViz,
    des: DesViz,
}

// ... (Logique inchangée) ...
function parseStepDescription(desc: string) {
    if (!desc) return { title: "Étape invalide", details: [] } // Laissé en dur, car c'est un fallback d'erreur
    const lines = desc.split("\n").map((line) => line.trim())
    const title = lines[0]
    const details = lines.slice(1).map((line) => line.replace(/^-/, "").trim())
    return { title, details }
}

export default function SimulatorPage() {
    const { language } = useLanguage()
    const t = useTranslation(language)

    const [simResult, setSimResult] = useState<any>(null)
    const [finalOutput, setFinalOutput] = useState<any>(null)
    const [isSimulating, setIsSimulating] = useState(false)
    const [isVizFullscreen, setIsVizFullscreen] = useState(false)

    const pathname = usePathname()
    const algoId = pathname ? pathname.split("/").pop() : undefined

    // --- GESTION DU CHARGEMENT ---
    if (!algoId || algoId === "simulations") {
        return (
            // REMARQUE : `main` est simplifié, le fond est géré par globals.css (body)
            <main className="min-h-screen">
                <Navigation />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="text-center">
                        <div className="animate-pulse">
                            {/* REMARQUE : Utilisation de var(--color-violet) */}
                            <Key className="w-16 h-16 mx-auto mb-4 text-[var(--color-violet)] opacity-50" />
                        </div>
                        {/* REMARQUE : Utilisation de .text-gradient */}
                        <h1 className="text-2xl font-semibold text-gradient mb-2">
                            {t("sim.loading")}
                        </h1>
                        <p className="text-foreground-secondary">
                            {t("sim.wait")}
                        </p>
                    </div>
                </div>
            </main>
        )
    }

    const algorithm = algorithms.find((a) => a.id === algoId)
    const SimulatorComponent = simulatorMap[algoId as string] || null
    const VizComponent = vizMap[algoId as string] || DataCube

    // --- GESTION "NON TROUVÉ" ---
    if (!algorithm || !SimulatorComponent) {
        return (
            <main className="min-h-screen">
                <Navigation />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="text-center">
                        <FileText className="w-16 h-16 mx-auto mb-4 text-foreground-secondary" />
                        {/* REMARQUE : Utilisation de .text-gradient */}
                        <h1 className="text-3xl font-bold text-gradient mb-4">
                            {t("sim.notFound.title")}
                        </h1>
                        <p className="text-foreground-secondary text-lg max-w-md mx-auto">
                            {t("sim.notFound.desc")}
                        </p>
                    </div>
                </div>
            </main>
        )
    }

    // --- FONCTIONS DE RAPPEL (Callbacks) ---
    // ... (Logique inchangée) ...
    const clearResults = () => {
        setSimResult(null)
        setFinalOutput(null)
        setIsSimulating(false)
    }

    const handleSimulationStart = () => {
        setIsSimulating(true)
    }

    const handleSimulationEnd = (result: any, output: any) => {
        setSimResult(result)
        setFinalOutput(output)
        setIsSimulating(false)
    }

    // Traduit le nom et la description de l'algorithme
    const algoName = t(algorithm.name, algorithm.name)
    const algoDesc = t(algorithm.description, algorithm.description)
    const algoCategory = t(algorithm.category, algorithm.category)


    return (
        <main
            // REMARQUE : Fond géré par globals.css (body)
            className={`min-h-screen w-full overflow-x-hidden ${
                isVizFullscreen ? "overflow-y-hidden" : ""
            }`}
        >
            <Navigation />

            {/* --- EN-TÊTE AMÉLIORÉ --- */}
            {/* REMARQUE : Style de l'en-tête aligné sur la Navbar (glass) */}
            <div className="border-b border-[var(--border-color)] bg-[var(--surface)] backdrop-blur-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                        <div className="flex items-start gap-4 flex-1 min-w-0">
                            {/* REMARQUE : Utilisation du style .glass pour l'icône */}
                            <div className="text-4xl p-3 glass rounded-xl">
                                {algorithm.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-3">
                                    <Badge
                                        variant="secondary"
                                        // REMARQUE : Utilisation de var(--color-violet)
                                        className="bg-[var(--color-violet)]/10 text-[var(--color-violet)] border-[var(--color-violet)]/20"
                                    >
                                        <Zap className="w-3 h-3 mr-1" />
                                        {t("sim.badge")}
                                    </Badge>
                                    {/* REMARQUE : Utilisation du style .glass pour le badge */}
                                    <Badge variant="outline" className="glass text-xs">
                                        {algoCategory}
                                    </Badge>
                                </div>
                                {/* REMARQUE : Utilisation de .text-gradient */}
                                <h1 className="text-3xl lg:text-4xl font-bold text-gradient mb-3 break-words">
                                    {algoName}
                                </h1>
                                <p className="text-foreground-secondary text-lg leading-relaxed max-w-3xl">
                                    {algoDesc}
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-2 flex-shrink-0">
                            {/* REMARQUE : Utilisation du style .glass pour le bouton */}
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={clearResults}
                                disabled={!simResult && !finalOutput}
                                className="glass rounded-lg gap-2"
                            >
                                <RotateCcw className="w-4 h-4" />
                                {t("sim.reset")}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- NOUVELLE STRUCTURE DE PAGE --- */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

                {/* --- 1. PANNEAU DE CONTRÔLE (PLEINE LARGEUR) --- */}
                {/* REMARQUE : Utilisation de .glass */}
                <Card className="glass">
                    {/* REMARQUE : Bordure mise à jour */}
                    <CardHeader className="pb-4 border-b border-[var(--border-color)]">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div
                                    className={`p-2 rounded-lg ${
                                        isSimulating
                                            // REMARQUE : Utilisation de var(--color-violet)
                                            ? "bg-[var(--color-violet)]/20 text-[var(--color-violet)] animate-pulse"
                                            : "bg-[var(--surface)] text-foreground-secondary"
                                    }`}
                                >
                                    {isSimulating ? (
                                        <Square className="w-5 h-5" />
                                    ) : (
                                        <Play className="w-5 h-5" />
                                    )}
                                </div>
                                <CardTitle className="text-xl">
                                    {isSimulating
                                        ? t("sim.simulating")
                                        : t("sim.controls")}
                                </CardTitle>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <SimulatorComponent
                            setSimResult={setSimResult}
                            setFinalOutput={setFinalOutput}
                            clearResults={clearResults}
                            onSimulationStart={handleSimulationStart}
                            onSimulationEnd={handleSimulationEnd}
                            isSimulating={isSimulating}
                        />
                    </CardContent>
                </Card>

                {/* --- 2. GRILLE VISUALISATION + SORTIE (CÔTE À CÔTE) --- */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* VISUALISATION 3D */}
                    {/* REMARQUE : Utilisation de .glass */}
                    <Card className="glass lg:h-[450px] flex flex-col">
                        <CardHeader className="pb-4 border-b border-[var(--border-color)] flex-shrink-0 relative">
                            <CardTitle className="flex items-center gap-2 text-xl">
                                <div
                                    className={`w-2 h-2 rounded-full ${
                                        isSimulating
                                            // REMARQUE : Utilisation de var(--color-rose)
                                            ? "bg-[var(--color-rose)] animate-pulse"
                                            : "bg-[var(--border-color)]"
                                    }`}
                                />
                                {t("simulator.visualization")} {isSimulating ? t("sim.viz.running") : ""}
                            </CardTitle>

                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute top-3 right-3 w-8 h-8 text-foreground-secondary hover:text-foreground hover:bg-[var(--surface-hover)]"
                                onClick={() => setIsVizFullscreen(true)}
                            >
                                <Expand className="w-4 h-4" />
                            </Button>

                        </CardHeader>
                        <CardContent className="p-0 flex-grow relative overflow-hidden rounded-b-lg">
                            <div className="relative h-full bg-gradient-to-br from-transparent to-[var(--surface)]/20">
                                <VizComponent simulationData={simResult} />
                                {!simResult && !isSimulating && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="text-center text-foreground-secondary p-6">
                                            <Key
                                                // REMARQUE : Utilisation de var(--color-violet)
                                                className="w-12 h-12 mx-auto mb-4 text-[var(--color-violet)] opacity-50"
                                            />
                                            <p className="font-medium">{t("sim.viz.awaiting")}</p>
                                            <p className="text-sm mt-1">
                                                {t("sim.viz.appearHere")}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* RÉSULTAT FINAL */}
                    {/* REMARQUE : Utilisation de .glass */}
                    <Card className="glass lg:h-[450px] flex flex-col">
                        <CardHeader className="pb-4 border-b border-[var(--border-color)] flex-shrink-0">
                            <CardTitle className="flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                                {t("sim.results.title")}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 flex-grow flex flex-col">
                            {finalOutput ? (
                                <div className="space-y-4">
                                    <Label className="text-sm font-semibold text-foreground-secondary">
                                        {t("sim.results.output")}
                                    </Label>
                                    <div className="relative">
                                        {/* REMARQUE : Style du bloc de code mis à jour */}
                                        <code className="block w-full rounded-xl bg-[var(--surface)] p-6 text-lg font-mono font-bold text-[var(--color-rose)] break-words border border-[var(--border-color)]">
                                            {finalOutput.cipher_hex ||
                                                finalOutput.cipher ||
                                                finalOutput.plain ||
                                                finalOutput.hash ||
                                                finalOutput.final_result_hex ||
                                                finalOutput.final_result ||
                                                JSON.stringify(finalOutput)}
                                        </code>
                                        <div className="absolute top-3 right-3 w-3 h-3 bg-[var(--color-rose)] rounded-full animate-pulse" />
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-12 text-foreground-secondary h-full flex flex-col justify-center items-center">
                                    <FileText
                                        className="w-12 h-12 mx-auto mb-4 opacity-50"
                                    />
                                    <p className="text-lg font-medium mb-2">
                                        {t("sim.results.none")}
                                    </p>
                                    <p className="text-sm">
                                        {t("sim.results.runSim")}
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* --- 3. ONGLETS (ÉTAPES / INFOS) --- */}
                <Tabs defaultValue="steps" className="w-full">
                    {/* REMARQUE : Utilisation de .glass pour le fond des onglets */}
                    <TabsList className="grid w-full grid-cols-2 glass p-1 rounded-2xl">
                        <TabsTrigger
                            value="steps"
                            // REMARQUE : Couleur d'accent mise à jour
                            className="rounded-xl data-[state=active]:bg-[var(--color-violet)] data-[state=active]:text-white transition-all duration-200"
                        >
                            <ChevronsRight className="w-4 h-4 mr-2" />
                            {t("sim.tabs.steps")}
                        </TabsTrigger>
                        <TabsTrigger
                            value="info"
                            // REMARQUE : Couleur d'accent mise à jour
                            className="rounded-xl data-[state=active]:bg-[var(--color-violet)] data-[state=active]:text-white transition-all duration-200"
                        >
                            <Info className="w-4 h-4 mr-2" />
                            {t("sim.tabs.info")}
                        </TabsTrigger>
                    </TabsList>

                    {/* PANNEAU DES ÉTAPES (AMÉLIORÉ) */}
                    <TabsContent value="steps" className="mt-6">
                        {/* REMARQUE : Utilisation de .glass */}
                        <Card className="glass">
                            <CardHeader className="pb-4 border-b border-[var(--border-color)]">
                                <CardTitle className="flex items-center gap-2">
                                    {/* REMARQUE : Utilisation de var(--color-violet) */}
                                    <Layers className="w-5 h-5 text-[var(--color-violet)]" />
                                    {t("sim.steps.title")}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6">
                                {simResult && simResult.steps ? (
                                    <ScrollArea className="h-[500px] w-full">
                                        <div className="space-y-3 pr-4">
                                            {simResult.steps.map((step: any, index: number) => {
                                                const { title: descTitle, details } = parseStepDescription(
                                                    step.description,
                                                )
                                                const stepNumber =
                                                    step.step !== undefined ? step.step : index
                                                const isInit = stepNumber === 0
                                                const isFinal =
                                                    stepNumber === simResult.steps.length - 1

                                                // Traduction du titre
                                                const title = isFinal
                                                    ? t("sim.results.title")
                                                    : isInit
                                                        ? t("sim.steps.init")
                                                        : t("sim.steps.step", { stepNumber })

                                                return (
                                                    <div
                                                        key={index}
                                                        // REMARQUE : Style "mini-glass" de l'étape mis à jour
                                                        className="flex items-start gap-4 p-4 rounded-xl border border-[var(--border-color)] bg-[var(--surface)] transition-all duration-200 hover:border-[var(--color-rose)]/50 hover:bg-[var(--surface-hover)]"
                                                    >
                                                        <div
                                                            className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mt-1 text-white ${
                                                                isInit
                                                                    // REMARQUE : Couleurs d'accent
                                                                    ? "bg-[var(--color-magenta)]"
                                                                    : isFinal
                                                                        ? "bg-green-500"
                                                                        : "bg-[var(--color-violet)]"
                                                            }`}
                                                        >
                                                            {isInit ? (
                                                                <Zap className="w-4 h-4" />
                                                            ) : isFinal ? (
                                                                <CheckCircle2 className="w-4 h-4" />
                                                            ) : (
                                                                stepNumber
                                                            )}
                                                        </div>

                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-semibold text-base mb-2 text-foreground">
                                                                {title}
                                                            </p>
                                                            <p className="text-foreground-secondary mb-3 leading-relaxed break-words">
                                                                {descTitle}
                                                            </p>

                                                            {details.length > 0 && (
                                                                // REMARQUE : Couleur d'accent
                                                                <div className="space-y-2 text-sm text-foreground-secondary pl-4 border-l-2 border-[var(--color-violet)]/30">
                                                                    {details.map((detail, dIndex) => (
                                                                        <p
                                                                            key={dIndex}
                                                                            className="flex items-start gap-2"
                                                                        >
                                                                            <ChevronRight className="w-3 h-3 mt-1 flex-shrink-0 text-[var(--color-violet)]" />
                                                                            <span className="break-words">{detail}</span>
                                                                        </p>
                                                                    ))}
                                                                </div>
                                                            )}

                                                            {step.intermediate_result && (
                                                                // REMARQUE : Styles mis à jour
                                                                <div className="mt-3 p-3 bg-[var(--surface)]/50 rounded-lg border border-[var(--border-color)]/50">
                                                                    <p className="text-xs font-semibold text-[var(--color-magenta)] mb-1">
                                                                        {t("sim.steps.intermediate")}
                                                                    </p>
                                                                    <code className="text-xs font-mono text-foreground break-words">
                                                                        {step.intermediate_result}
                                                                    </code>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </ScrollArea>
                                ) : (
                                    <div className="text-center py-12 text-foreground-secondary">
                                        <ChevronsRight
                                            className="w-12 h-12 mx-auto mb-4 opacity-50"
                                        />
                                        <p className="text-lg font-medium mb-2">
                                            {t("sim.steps.none")}
                                        </p>
                                        <p className="text-sm">
                                            {t("sim.steps.runSim")}
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* PANNEAU D'INFO */}
                    <TabsContent value="info" className="mt-6">
                        <AlgorithmInfoCard algorithm={algorithm} />
                    </TabsContent>
                </Tabs>
            </div>

            {/* --- 4. MODALE PLEIN ÉCRAN (AJOUTÉE) --- */}
            {isVizFullscreen && (
                <div
                    // Le conteneur "flouté"
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md animate-in fade-in-0"
                    onClick={() => setIsVizFullscreen(false)} // Ferme en cliquant sur le fond
                >
                    <Card
                        // REMARQUE : Utilisation de .glass pour la modale
                        className="glass relative w-[90vw] h-[90vh] flex flex-col"
                        onClick={(e) => e.stopPropagation()} // Empêche la fermeture en cliquant sur la carte
                    >
                        <CardHeader className="flex flex-row items-center justify-between border-b border-[var(--border-color)]">
                            <CardTitle className="text-gradient">
                                {t("simulator.visualization")} - {algoName}
                            </CardTitle>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsVizFullscreen(false)}
                                className="hover:bg-[var(--surface-hover)]"
                            >
                                <X className="w-5 h-5" />
                            </Button>
                        </CardHeader>
                        <CardContent className="flex-grow p-0 overflow-hidden rounded-b-lg">
                            {/* Rend la 3D à l'intérieur de la modale */}
                            <VizComponent simulationData={simResult} />
                        </CardContent>
                    </Card>
                </div>
            )}
        </main>
    )
}