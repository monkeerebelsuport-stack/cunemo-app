import { supabase } from "@/lib/supabase";

interface OnboardingData {
    role: string;
    industry: string;
    currency: string;
    seedContacts: { name: string; company: string; email: string }[];
    firstDeal: { title: string; value: string; probability: string };
}

export async function saveOnboardingData(data: OnboardingData) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("No authenticated user");

    try {


        // 1. Guardar Perfil (Simulado si no hay tabla profiles, o en auth metadata)
        // Por ahora asumimos que solo guardamos datos de negocio, ya que profiles a veces requiere trigger
        // TODO: Actualizar user_metadata en Auth si es necesario

        // 2. Guardar Contactos y sus Empresas
        // Iteramos sobre los contactos semilla
        const seedContacts = data.seedContacts || [];
        let firstAccountId = null;

        for (const contact of seedContacts) {
            if (!contact.name || !contact.company) continue;

            // A. Crear Empresa (Account)
            const { data: accountData, error: accountError } = await supabase
                .from('accounts')
                .insert({
                    name: contact.company,
                    industry: data.industry, // Usamos la industria seleccionada en el paso 1
                    user_id: user.id // Blindaje: Vínculo explícito
                })
                .select()
                .single();

            if (accountError) {
                console.error("Error creating account:", accountError);
                continue;
            }

            if (!firstAccountId) firstAccountId = accountData.id;

            // B. Crear Contacto
            const { error: contactError } = await supabase
                .from('contacts')
                .insert({
                    first_name: contact.name, // Simplificación: asume nombre completo en first_name por ahora o split
                    email: contact.email,
                    account_id: accountData.id,
                    user_id: user.id // Blindaje: Vínculo explícito
                });

            if (contactError) console.error("Error creating contact:", contactError);
        }

        // 3. Guardar Primer Negocio (Victoria)
        // Lo asociamos a la primera empresa creada para que tenga sentido
        const deal = data.firstDeal;
        if (deal && deal.title && firstAccountId) {
            const { error: dealError } = await supabase
                .from('deals')
                .insert({
                    name: deal.title,
                    value: parseFloat(deal.value),
                    probability: parseInt(deal.probability),
                    stage: getStageFromProbability(deal.probability),
                    account_id: firstAccountId,
                    user_id: user.id // Blindaje: Vínculo explícito
                });

            if (dealError) console.error("Error creating deal:", dealError);
        }

        return { success: true };

    } catch (error) {
        console.error("Fatal error in onboarding save:", error);
        throw error;
    }
}

function getStageFromProbability(prob: string): string {
    switch (prob) {
        case "20": return "LEAD";
        case "50": return "PROPOSAL";
        case "80": return "NEGOTIATION";
        default: return "LEAD";
    }
}
