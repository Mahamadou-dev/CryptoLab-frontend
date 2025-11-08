import { NextResponse } from 'next/server';

const WEB3FORMS_URL = "https://api.web3forms.com/submit";

export async function POST(request: Request) {
    try {
        const data = await request.json();

        // Lisez la clé depuis les variables d'environnement (serveur)
        const WEB3FORMS_KEY = process.env.WEB3FORMS_KEY;

        if (!WEB3FORMS_KEY) {
            return NextResponse.json({
                success: false,
                message: "Clé d'accès serveur manquante."
            }, { status: 500 });
        }

        // Ajoutez la clé secrète aux données du formulaire
        const formData = {
            ...data,
            access_key: WEB3FORMS_KEY,
            sujet: `Rapport de Problème - CryptoLab (${data.type})`,
        };

        // Appelez Web3Forms depuis le serveur
        const response = await fetch(WEB3FORMS_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(formData),
        });

        const result = await response.json();

        if (result.success) {
            return NextResponse.json(result, { status: 200 });
        } else {
            // Transférer l'erreur de Web3Forms
            return NextResponse.json(result, { status: response.status });
        }

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Erreur interne du serveur."
        }, { status: 500 });
    }
}