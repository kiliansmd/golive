"use client"

import Image from "next/image"
import {
    Mail,
    Phone,
    MapPin,
    Calendar,
    Award,
    Briefcase,
    GraduationCap,
    Languages,
    CheckCircle,
    ArrowRight,
    Star,
    Users,
    Shield,
    Clock,
    Target,
    ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { getIconComponent } from "@/utils/icon-mapper"
import type { Kandidat, AccountManager, NavigationItem } from "@/types/kandidat"
import { useState } from 'react'

export function KandidatenProfile({
    kandidat,
    accountManager,
    navSections,
}: {
    kandidat: Kandidat
    accountManager: AccountManager
    navSections: NavigationItem[]
}) {
    const [shareUrl, setShareUrl] = useState<string | null>(null)
    const [shareError, setShareError] = useState<string | null>(null)
    const [isLoadingShare, setIsLoadingShare] = useState(false)
    const handleShare = async () => {
        setIsLoadingShare(true)
        setShareError(null)
        setShareUrl(null)
        try {
            const res = await fetch('/api/share-link', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ kandidatId: kandidat.name }),
            })
            const data = await res.json()
            if (!res.ok) {
                setShareError(data.error || 'Fehler beim Erstellen des Links')
            } else {
                setShareUrl(data.url)
            }
        } catch (e) {
            setShareError('Fehler beim Erstellen des Links')
        } finally {
            setIsLoadingShare(false)
        }
    }
    const newLocal = <Card className="bg-white border border-gray-200 shadow-sm overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-yellow-400 to-yellow-500"></div>
        <CardContent className="p-6">
            <h3 className="text-heading-4 mb-6 text-gray-900 flex items-center">
                <Award className="h-5 w-5 text-yellow-500 mr-2" />
                Zertifizierungen
            </h3>
            <div className="space-y-4">
                {kandidat?.certificates?.length > 0 ? kandidat.certificates.map((cert, index) => (
                    <div
                        key={index}
                        className="flex items-start gap-4 p-3 bg-yellow-50/50 rounded-lg border border-yellow-100/50 hover:bg-yellow-50 transition-colors"
                    >
                        <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0">
                            <Award className="h-5 w-5 text-yellow-600" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-900">{cert.name}</h4>
                            <p className="text-sm text-gray-600">{cert.description}</p>
                            <div className="flex items-center mt-1 text-xs text-gray-500">
                                <Calendar className="h-3 w-3 mr-1" />
                                <span>{cert.date}</span>
                                <span className="mx-2">•</span>
                                <span>{cert.issuer}</span>
                            </div>
                        </div>
                    </div>
                )) : <p className="text-gray-500">Keine Zertifizierungen gefunden</p>}
            </div>
        </CardContent>
    </Card>
    return (
        <main className="min-h-screen bg-white text-gray-900">
            {/* Header mit Logo und Navigation */}
            <header className="bg-black text-white border-b border-gray-800 sticky top-0 z-10 no-print-element">
                <div className="container mx-auto px-4 py-2 sm:py-3 flex justify-between items-center">
                    <div className="flex items-center gap-4 sm:gap-8">
                        <Image
                            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/getexperts_Logo%20white_2022_Logo-J8GvQFrl6vrMOgCpmr7p26XTKi8yl7.png"
                            alt="getexperts Logo"
                            width={180}
                            height={40}
                            className="h-6 sm:h-8 w-auto"
                        />

                        {/* Navigation */}
                        <nav className="hidden md:flex items-center space-x-6">
                            {navSections.map((section) => (
                                <a
                                    key={section.id}
                                    href={`#${section.id}`}
                                    className="text-sm text-gray-300 hover:text-white transition-colors"
                                >
                                    {section.label}
                                </a>
                            ))}
                        </nav>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3">
                        <Badge className="bg-orange-500 text-black font-medium px-2 py-0.5 sm:px-3 sm:py-1 text-xs sm:text-sm">
                            Premium Profil
                        </Badge>
                        <Button className="bg-purple hover:bg-purple/90 text-white text-xs sm:text-sm px-2 py-1 sm:px-4 sm:py-2" onClick={handleShare} disabled={isLoadingShare}>
                            {isLoadingShare ? 'Erstelle Link...' : 'Profil teilen'}
                        </Button>
                        <Button className="bg-purple hover:bg-purple/90 text-white text-xs sm:text-sm px-2 py-1 sm:px-4 sm:py-2">
                            Kontakt aufnehmen
                        </Button>
                    </div>
                </div>
                {shareUrl && (
                    <div className="bg-blue-50 border border-blue-200 text-blue-900 px-4 py-2 mt-2 rounded flex items-center gap-2 justify-center">
                        <span>Teilen-Link (gültig für 7 Tage):</span>
                        <input
                            type="text"
                            value={shareUrl}
                            readOnly
                            className="bg-transparent border-none text-blue-900 font-mono w-64 truncate cursor-pointer"
                            onClick={e => { (e.target as HTMLInputElement).select(); document.execCommand('copy'); }}
                            title="Klicken zum Kopieren"
                        />
                    </div>
                )}
                {shareError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 mt-2 rounded text-center">{shareError}</div>
                )}
            </header>

            {/* Hero Section - Schwarz */}
            <section className="bg-black text-white py-8 sm:py-12 lg:py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
                            <div className="w-full lg:w-2/3">
                                <div className="flex flex-wrap items-center gap-2 mb-4">
                                    <Badge className="bg-blue-600 text-white font-medium px-2 py-0.5 sm:px-3 sm:py-1 text-xs sm:text-sm">
                                        {kandidat.senioritaet} Expert Profile
                                    </Badge>
                                    <Badge className="bg-green-100 text-green-700 border border-green-200 font-medium px-2 py-0.5 sm:px-3 sm:py-1 text-xs sm:text-sm">
                                        Möchte Sie kennenlernen
                                    </Badge>
                                    <Badge
                                        variant="outline"
                                        className="border-gray-600 text-gray-300 font-medium px-2 py-0.5 sm:px-3 sm:py-1 text-xs sm:text-sm bg-gradient-to-r from-gray-900 to-gray-800"
                                    >
                                        <span className="text-yellow-400 mr-1">#</span>
                                        7100001451223
                                    </Badge>
                                </div>

                                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-heading-1 mb-2 text-white font-bold">
                                    {kandidat.name}
                                </h1>
                                <h2 className="text-xl sm:text-2xl md:text-heading-3 text-blue-400 font-medium mb-4 sm:mb-6">
                                    {kandidat.position}
                                </h2>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                                    <div className="flex items-center gap-2 text-gray-300">
                                        <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400" />
                                        <span className="text-sm sm:text-base">Standort: {kandidat.standort}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-300">
                                        <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400" />
                                        <span className="text-sm sm:text-base">Verfügbarkeit: {kandidat.verfuegbarkeit}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-300">
                                        <Briefcase className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400" />
                                        <span className="text-sm sm:text-base">Erfahrung: {kandidat.erfahrung}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-300">
                                        <Award className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400" />
                                        <span className="text-sm sm:text-base">Gehalt: {kandidat.gehalt}</span>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2 mt-3 sm:mt-4">
                                    {kandidat.kernthemen.map((thema, index) => (
                                        <Badge key={index} variant="outline" className="border-gray-600 bg-gray-800 text-gray-300 text-xs">
                                            {thema}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Kandidaten-Highlights Section */}
            <section id="highlights" className="py-14 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-heading-2 mb-4 text-gray-900 flex items-center border-b border-gray-200 pb-3">
                            <Star className="h-7 w-7 text-yellow-500 fill-yellow-500 mr-3" />
                            <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                                Kandidaten-Highlights
                            </span>
                        </h2>
                        <p className="text-body-large text-gray-600 mb-10">
                            Die interessantesten und relevantesten Keyfacts aus über 4 Jahren Berufserfahrung
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-8 sm:mb-10">
                            {kandidat.highlights.map((highlight, index) => {
                                const IconComponent = getIconComponent(highlight.icon)
                                return (
                                    <Card
                                        key={index}
                                        className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group"
                                    >
                                        <div className="absolute top-0 left-0 w-1 h-full bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        <CardContent className="p-4 sm:p-6 text-center">
                                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-50 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-sm">
                                                <IconComponent className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
                                            </div>
                                            <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">{highlight.metric}</div>
                                            <div className="text-xs sm:text-sm text-gray-500 mb-2 sm:mb-3">{highlight.label}</div>
                                            <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2 text-gray-900">
                                                {highlight.title}
                                            </h3>
                                            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{highlight.description}</p>
                                        </CardContent>
                                    </Card>
                                )
                            })}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="bg-white border border-gray-200 shadow-sm">
                                <CardContent className="p-6">
                                    <h3 className="text-heading-4 mb-4 text-gray-900 flex items-center">
                                        <CheckCircle className="h-5 w-5 text-blue-600 mr-2" />
                                        Besondere Qualifikationen
                                    </h3>
                                    <ul className="space-y-3">
                                        {kandidat.certificates.map((cert, index) => (
                                            <li key={index} className="flex items-start gap-3">
                                                <Award className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                                <div>
                                                    <span className="text-gray-900 font-medium">{cert.name}</span>
                                                    <span className="text-gray-600 text-sm block">{cert.description}</span>
                                                </div>
                                            </li>
                                        ))}
                                        {kandidat.jobrollen.slice(0, 2).map((rolle, index) => (
                                            <li key={index} className="flex items-start gap-3">
                                                <Briefcase className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                                <span className="text-gray-900">{rolle}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>

                            <Card className="bg-white border border-gray-200 shadow-sm">
                                <CardContent className="p-6">
                                    <h3 className="text-heading-4 mb-4 text-gray-900 flex items-center">
                                        <Users className="h-5 w-5 text-blue-600 mr-2" />
                                        Exklusives Kennenlernen
                                    </h3>
                                    <p className="text-body-normal text-gray-700 mb-4 leading-relaxed">
                                        Dieser Top-Kandidat ist ausschließlich über getexperts verfügbar. Vereinbaren Sie ein persönliches
                                        Gespräch und lernen Sie einen der gefragtesten Experten im DACH-Raum kennen.
                                    </p>
                                    <ul className="space-y-3 mb-6">
                                        <li className="flex items-start gap-3">
                                            <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
                                            <span className="text-gray-700">Sofortige Verfügbarkeit bestätigt</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                                            <span className="text-gray-700">Exklusiv über getexperts vermittelt</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <Target className="h-5 w-5 text-blue-600 mt-0.5" />
                                            <span className="text-gray-700">Diskrete und professionelle Abwicklung</span>
                                        </li>
                                    </ul>
                                    <Button className="w-full bg-purple hover:bg-purple/90 text-white no-print-element">
                                        Persönlich kennenlernen <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            {/* Profile Section */}
            <section id="profil" className="py-14 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-heading-2 mb-4 text-gray-900">Profil</h2>
                        <p className="text-body-large text-gray-600 mb-8">
                            Vielseitiger Fachmann mit Erfahrung darin, durch Anpassungsfähigkeiten und eine kooperative Denkweise zum Geschäftserfolg beizutragen.
                        </p>

                        {!!kandidat.kurzprofil && <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6 shadow-sm mb-10 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-200 to-transparent opacity-50 -z-10"></div>
                            <div className="flex flex-col md:flex-row gap-6 items-center">
                                <div className="w-full md:w-1/4 flex justify-center">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple rounded-full blur-md opacity-20 scale-110"></div>
                                        <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-100 to-blue-200 flex items-center justify-center relative z-10 border-2 border-white shadow-md">
                                            <span className="text-4xl font-bold text-blue-600">{kandidat.name.charAt(0)}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full md:w-3/4">
                                    <h3 className="text-heading-4 mb-3 text-gray-900 flex items-center">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="20"
                                            height="20"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="text-blue-600 mr-2"
                                        >
                                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                                        </svg>
                                        Über mich
                                    </h3>
                                    <p className="text-gray-700 leading-relaxed mb-4">
                                        {kandidat.kurzprofil}
                                    </p>
                                    <div className="flex flex-wrap gap-2 mt-3 sm:mt-4">
                                        {kandidat.kernthemen.map((thema, index) => (
                                            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full shadow-sm border border-gray-200">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="16"
                                                    height="16"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    className="text-blue-600"
                                                >
                                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                                </svg>
                                                <span className="text-sm text-gray-700"> {thema}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>}

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Card className="bg-white border border-gray-200 shadow-sm overflow-hidden">
                                <div className="h-2 bg-gradient-to-r from-blue-500 to-blue-600"></div>
                                <CardContent className="p-6">
                                    <h3 className="text-heading-4 mb-6 text-gray-900 flex items-center">
                                        <MapPin className="h-5 w-5 text-blue-600 mr-2" />
                                        Persönliche Daten
                                    </h3>
                                    <div className="flex flex-col space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                                <Calendar className="h-5 w-5 text-blue-600" />
                                            </div>
                                            <div>
                                                <span className="text-gray-500 text-sm block mb-1">Geboren</span>
                                                <span className="font-medium text-gray-900">
                                                    {kandidat.persoenlicheDaten.geburtsdatum} in {kandidat.persoenlicheDaten.geburtsort}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                                <MapPin className="h-5 w-5 text-blue-600" />
                                            </div>
                                            <div>
                                                <span className="text-gray-500 text-sm block mb-1">Wohnhaft in</span>
                                                <span className="font-medium text-gray-900">{kandidat.persoenlicheDaten.wohnort}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                                <Users className="h-5 w-5 text-blue-600" />
                                            </div>
                                            <div>
                                                <span className="text-gray-500 text-sm block mb-1">Familienstand</span>
                                                <span className="font-medium text-gray-900">{kandidat.persoenlicheDaten.familienstand}</span>
                                            </div>
                                        </div>

                                        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                                            <p className="text-sm text-blue-800 italic">
                                                "Ich schätze die Nähe zur Kölner Innenstadt und die lebendige Startup-Szene im Rheinland."
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-white border border-gray-200 shadow-sm overflow-hidden">
                                <div className="h-2 bg-gradient-to-r from-purple to-blue-600"></div>
                                <CardContent className="p-6">
                                    <h3 className="text-heading-4 mb-6 text-gray-900 flex items-center">
                                        <Briefcase className="h-5 w-5 text-blue-600 mr-2" />
                                        Software-Kenntnisse
                                    </h3>
                                    <ul className="space-y-4">
                                        {kandidat.softwareKenntnisse.map((software, index) => (
                                            <li key={index} className="text-gray-700">
                                                <div className="flex justify-between mb-2 items-center">
                                                    <div className="flex items-center">
                                                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                                                            {software.name.includes("SAP") ? (
                                                                <span className="font-bold text-xs text-blue-600">SAP</span>
                                                            ) : software.name.includes("Office") ? (
                                                                <span className="font-bold text-xs text-blue-600">MS</span>
                                                            ) : software.name.includes("CRM") ? (
                                                                <span className="font-bold text-xs text-blue-600">CRM</span>
                                                            ) : (
                                                                <span className="font-bold text-xs text-blue-600">RT</span>
                                                            )}
                                                        </div>
                                                        <span className="font-medium">{software.name}</span>
                                                    </div>
                                                    <span className="text-sm font-semibold text-blue-600">{software.level}%</span>
                                                </div>
                                                <Progress
                                                    value={software.level}
                                                    className="h-2 bg-gray-200"
                                                    indicatorClassName={`${software.level > 90
                                                        ? "bg-green-600"
                                                        : software.level > 80
                                                            ? "bg-blue-600"
                                                            : software.level > 70
                                                                ? "bg-yellow-500"
                                                                : "bg-orange-500"
                                                        }`}
                                                />
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                                        <p className="text-sm text-blue-800 italic">
                                            "Ich arbeite kontinuierlich daran, meine technischen Fähigkeiten zu erweitern und neue Tools zu
                                            erlernen."
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-white border border-gray-200 shadow-sm overflow-hidden">
                                <div className="h-2 bg-gradient-to-r from-blue-600 to-green-500"></div>
                                <CardContent className="p-6">
                                    <h3 className="text-heading-4 mb-6 text-gray-900 flex items-center">
                                        <Languages className="h-5 w-5 text-blue-600 mr-2" />
                                        Sprachkenntnisse
                                    </h3>
                                    <ul className="space-y-4">
                                        {kandidat.sprachkenntnisse.map((sprache, index) => (
                                            <li key={index} className="text-gray-700">
                                                <div className="flex justify-between mb-2 items-center">
                                                    <div className="flex items-center">
                                                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                                                            {sprache.sprache === "Deutsch" ? (
                                                                <span className="font-bold text-xs text-blue-600">DE</span>
                                                            ) : sprache.sprache === "Englisch" ? (
                                                                <span className="font-bold text-xs text-blue-600">EN</span>
                                                            ) : (
                                                                <span className="font-bold text-xs text-blue-600">FR</span>
                                                            )}
                                                        </div>
                                                        <span className="font-medium">{sprache.sprache}</span>
                                                    </div>
                                                    <span className="text-sm text-gray-500 px-2 py-1 bg-gray-100 rounded-full">
                                                        {sprache.niveau}
                                                    </span>
                                                </div>
                                                <Progress
                                                    value={sprache.level}
                                                    className="h-2 bg-gray-200"
                                                    indicatorClassName={`${sprache.niveau === "Muttersprache"
                                                        ? "bg-green-600"
                                                        : sprache.niveau === "Berufliche Kenntnisse"
                                                            ? "bg-blue-600"
                                                            : "bg-yellow-500"
                                                        }`}
                                                />
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                                        <p className="text-sm text-blue-800 italic">
                                            "Ich kommuniziere fließend auf Deutsch und Englisch und arbeite gerne in internationalen Teams."
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Zertifizierungen und Auszeichnungen */}
                        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
                            {newLocal}
                            <Card className="bg-white border border-gray-200 shadow-sm overflow-hidden">
                                <div className="h-2 bg-gradient-to-r from-blue-500 to-purple"></div>
                                <CardContent className="p-6">
                                    <h3 className="text-heading-4 mb-6 text-gray-900 flex items-center">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="20"
                                            height="20"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="text-blue-600 mr-2"
                                        >
                                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                                        </svg>
                                        Stärken & Fähigkeiten
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {kandidat.kernthemen.map((thema, index) => (
                                                <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full shadow-sm border border-gray-200">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="16"
                                                        height="16"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        className="text-blue-600"
                                                    >
                                                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                                    </svg>
                                                    <span className="text-sm text-gray-700"> {thema}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            {/* Education Section */}
            <section id="ausbildung" className="py-14 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-heading-2 mb-10 text-gray-900 flex items-center">
                            <GraduationCap className="h-7 w-7 text-blue-600 mr-3" />
                            Ausbildung
                        </h2>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {kandidat.education.map((edu, index) => (
                                <Card
                                    key={index}
                                    className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                                >
                                    <CardContent className="p-6 md:p-8">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                            <div className="flex-1">
                                                <h3 className="text-heading-3 mb-2 text-gray-900">{edu.studyType}</h3>
                                                <p className="text-blue-700 font-medium text-lg mb-2">{edu.institution}</p>
                                                <p className="text-gray-700">{edu.area}</p>
                                                {edu.note && <p className="text-gray-600 text-sm italic">{edu.note}</p>}
                                            </div>
                                            <div className="text-gray-500 text-sm md:text-right">
                                                <span className="inline-block px-4 py-2 bg-gray-50 rounded-full border border-gray-200">
                                                    {edu.startDate} - {edu.endDate}
                                                </span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Work Experience Section */}
            <section id="erfahrung" className="py-14 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-heading-2 mb-4 text-gray-900 flex items-center">
                            <Briefcase className="h-7 w-7 text-blue-600 mr-3" />
                            Berufserfahrung
                        </h2>
                        <p className="text-body-large text-gray-600 mb-10">Langjährige Expertise in verschiedenen Unternehmen</p>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {kandidat.work.map((job, index) => {
                                return (
                                    <Card
                                        key={index}
                                        className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                                    >
                                        <CardContent className="p-6 md:p-8 relative">
                                            {job.endDate === "Present" && (
                                                <div className="absolute top-4 right-4">
                                                    <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white font-medium px-3 py-1 shadow-sm">
                                                        <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                                                        Aktuelle Position
                                                    </Badge>
                                                </div>
                                            )}
                                            <div className="flex flex-col justify-between gap-4 mb-6">
                                                <div className="flex-1">
                                                    <h3 className="text-heading-3 mb-2 text-gray-900">{job.position}</h3>
                                                    <p className="text-blue-700 font-medium text-lg mb-2">{job.name}</p>
                                                    <p className="text-gray-700">{job.summary}</p>
                                                </div>
                                                <div className="text-gray-500 text-sm">
                                                    {!!job?.startDate && !!job?.endDate && <span
                                                        className={`inline-block px-4 py-2 rounded-full border ${!!job?.endDate && job.endDate === "Present"
                                                            ? "bg-green-50 border-green-200 text-green-700 font-medium"
                                                            : "bg-gray-50 border-gray-200"
                                                            }`}
                                                    >
                                                        {!!job?.startDate && new Date(job.startDate).toLocaleDateString("de-DE", { year: "numeric", month: "numeric" })} -
                                                        {!!job?.endDate && job.endDate === "Present"
                                                            ? " Heute"
                                                            : ` ${new Date(job.endDate).toLocaleDateString("de-DE", { year: "numeric", month: "numeric" })}`}
                                                    </span>}
                                                </div>
                                            </div>
                                            {job.achievements && job.achievements.length > 0 && (
                                                <div
                                                    className={`p-4 rounded-lg border ${job?.endDate && job.endDate === "Present" ? "bg-green-50 border-green-100" : "bg-blue-50 border-blue-100"
                                                        }`}
                                                >
                                                    <h4 className="font-semibold text-gray-900 mb-3">Erfolge & Verantwortlichkeiten:</h4>
                                                    <ul className="space-y-2">
                                                        {job.achievements.map((achievement, idx) => (
                                                            <li key={idx} className="flex items-start gap-3">
                                                                <CheckCircle
                                                                    className={`h-5 w-5 mt-1 flex-shrink-0 ${job?.endDate && job.endDate === "Present" ? "text-green-600" : "text-blue-600"
                                                                        }`}
                                                                />
                                                                <span className="text-gray-700">{achievement}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* Verfügbarkeit Section */}
            <section className="py-10 bg-purple text-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Clock className="h-6 w-6" />
                                <h2 className="text-heading-3">Verfügbarkeit</h2>
                            </div>
                            <p className="text-body-large text-white/80">
                                Kandidat verfügbar ab: <span className="font-semibold">{kandidat.verfuegbarkeit}</span>
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                                <Badge className="bg-blue-500 text-white px-3 py-1 flex items-center gap-1">
                                    <div className="w-2 h-2 bg-white rounded-full mr-1"></div>
                                    Online verfügbar
                                </Badge>
                                <Badge className="bg-orange-500 text-black px-3 py-1">Premium Kandidat</Badge>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer mit Vertrauenselementen */}
            <footer id="kontakt" className="py-12 bg-gray-900 text-white no-print-element">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        {/* Trust Indicators */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12 text-center">
                            <div className="flex flex-col items-center">
                                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mb-3">
                                    <Users className="h-6 w-6 text-white" />
                                </div>
                                <div className="text-2xl font-bold text-white mb-1">5.000+</div>
                                <div className="text-gray-400 text-sm">Experten im Pool</div>
                                <div className="flex mt-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star key={star} className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                                    ))}
                                </div>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mb-3">
                                    <Star className="h-6 w-6 text-white" />
                                </div>
                                <div className="text-2xl font-bold text-white mb-1">4.8/5</div>
                                <div className="text-gray-400 text-sm">Kundenbewertung</div>
                                <div className="flex mt-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star key={star} className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                                    ))}
                                </div>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mb-3">
                                    <Shield className="h-6 w-6 text-white" />
                                </div>
                                <div className="text-2xl font-bold text-white mb-1">100%</div>
                                <div className="text-gray-400 text-sm">DSGVO-konform</div>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="w-12 h-12 bg-purple rounded-full flex items-center justify-center mb-3">
                                    <Clock className="h-6 w-6 text-white" />
                                </div>
                                <div className="text-2xl font-bold text-white mb-1">seit 2020</div>
                                <div className="text-gray-400 text-sm">Marktführer</div>
                            </div>
                        </div>

                        <Separator className="bg-gray-800 mb-8" />

                        <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-8">
                            <div className="max-w-md">
                                <Image
                                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/getexperts_Logo%20white_2022_Logo-J8GvQFrl6vrMOgCpmr7p26XTKi8yl7.png"
                                    alt="getexperts Logo"
                                    width={140}
                                    height={30}
                                    className="h-6 w-auto mb-4"
                                />
                                <p className="text-gray-400 leading-relaxed mb-4">
                                    Spezialisiert auf die Vermittlung hochqualifizierter IT-Experten und Führungskräfte für anspruchsvolle
                                    Projekte. Vertrauen Sie auf unsere Expertise und unser umfangreiches Netzwerk.
                                </p>

                                <div className="flex items-center gap-2 mb-3">
                                    <div className="flex">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star key={star} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                                        ))}
                                    </div>
                                    <span className="text-sm text-gray-400">4.8/5 Sterne</span>
                                </div>
                                <p className="text-sm text-gray-400">Über 50 Partner setzen seit 2020 auf unsere Expertise</p>
                            </div>

                            <div>
                                <h3 className="font-semibold mb-4 text-white">Kontakt</h3>
                                <address className="not-italic text-gray-400 space-y-2">
                                    <p className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-blue-400" />
                                        Rudolfplatz 3, 50674 Köln
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <Phone className="h-4 w-4 text-blue-400" />
                                        +49 2111 7607 313
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <Mail className="h-4 w-4 text-blue-400" />
                                        kontakt@getexperts.io
                                    </p>
                                    <p className="text-blue-400 hover:text-blue-300 transition-colors">www.getexperts.io</p>
                                </address>
                            </div>

                            <div>
                                <h3 className="font-semibold mb-4 text-white">Zertifizierungen & Auszeichnungen</h3>
                                <div className="space-y-2 text-gray-400 mb-4">
                                    <p className="flex items-center gap-2">
                                        <Shield className="h-4 w-4 text-blue-400" />
                                        ISO 27001 zertifiziert
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-blue-400" />
                                        DSGVO-konform
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <Award className="h-4 w-4 text-yellow-400" />
                                        Top Employer 2024
                                    </p>
                                </div>
                            </div>
                        </div>

                        <Separator className="bg-gray-800 mb-6" />

                        <div className="flex flex-col md:flex-row justify-between items-center">
                            <div className="text-gray-500 text-sm mb-4 md:mb-0">
                                © {new Date().getFullYear()} getexperts GmbH. Alle Rechte vorbehalten.
                            </div>
                            <div className="flex gap-6 text-gray-500 text-sm">
                                <a href="#" className="hover:text-white transition-colors">
                                    Datenschutz
                                </a>
                                <a href="#" className="hover:text-white transition-colors">
                                    Impressum
                                </a>
                                <a href="#" className="hover:text-white transition-colors">
                                    AGB
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Scroll to top button */}
            <a
                href="#"
                className="fixed bottom-6 right-6 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors no-print-element"
                aria-label="Zum Seitenanfang"
            >
                <ChevronRight className="h-5 w-5 rotate-[-90deg]" />
            </a>

            {/* Sticky Bottom Bar für Terminvereinbarung */}
            <div
                className="fixed bottom-0 left-0 right-0 z-20 border-t border-blue-800 no-print-element"
                style={{
                    backgroundColor: "#0a2e65",
                    boxShadow: "0 -10px 30px rgba(0, 0, 0, 0.15)",
                }}
            >
                <div className="container mx-auto px-4 py-3 sm:py-5">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
                        <div className="flex items-center gap-3 sm:gap-4">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center shadow-md">
                                <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-white text-base sm:text-lg tracking-tight">
                                    Exklusives Gespräch vereinbaren
                                </h3>
                                <p className="text-white text-xs sm:text-sm">
                                    Sichern Sie sich einen persönlichen Termin in nur 1 Minute
                                </p>
                                <p className="text-white text-xs mt-1 hidden sm:block">
                                    Unverbindliches Kennenlernen • 100% erfolgsbasiert
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                            <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
                                <div className="hidden sm:flex items-center gap-2 text-white bg-blue-800/40 px-3 py-1.5 rounded-full text-sm">
                                    <Clock className="h-4 w-4" />
                                    <span>Sofort verfügbar</span>
                                </div>
                                <Button className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white font-medium px-4 sm:px-6 py-2 sm:py-2.5 shadow-lg border border-yellow-300/20 transition-all duration-200 w-full sm:w-auto">
                                    <Calendar className="mr-2 h-4 w-4" />
                                    Termin vorschlagen
                                </Button>
                            </div>
                            <p className="text-white text-xs italic hidden sm:block">
                                Wir rechnen ausschließlich im Erfolgsfall nach Vertragsunterzeichnung ab.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Spacer für sticky bottom bar - größer für mobile */}
            <div className="h-24 sm:h-20 no-print-element"></div>

            {/* Handwritten underline style */}
            <style jsx global>{`
        .handwritten-underline::after {
          content: "";
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 100%;
          height: 2px;
          background-image: url("data:image/svg+xml,%3Csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M 0,1.5 Q 5,0 10,1.5 T 20,1.5 T 30,1.5 T 40,1.5 T 50,1.5 T 60,1.5 T 70,1.5 T 80,1.5 T 90,1.5 T 100,1.5' stroke='%230a2e65' strokeWidth='1.5' fill='none' strokeLinecap='round' strokeDasharray='0,0'/%3E%3C/svg%3E");
          background-position: 0 100%;
          background-size: cover;
          background-repeat: no-repeat;
          opacity: 0.8;
          pointer-events: none;
        }
        
        /* Druckspezifische Styles */
        @media print {
          .print-only {
            display: block !important;
          }
          
          .print-logo {
            filter: invert(1);
          }
          
          .no-print-element {
            display: none !important;
          }
          
          /* Seitenzahlen */
          @page {
            counter-increment: page;
          }
          
          .print-page-number:after {
            content: counter(page);
          }
        }
        
        .hidden.print-only {
          display: none;
        }
        
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.5;
            transform: scale(1.1);
          }
          50% {
            opacity: 0.3;
            transform: scale(1.15);
          }
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
      `}</style>
        </main>
    )
}
