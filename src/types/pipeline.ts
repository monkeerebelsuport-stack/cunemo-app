export type DealStage = "LEAD" | "QUALIFIED" | "PROPOSAL" | "NEGOTIATION" | "CLOSED" | "WON" | "LOST";

export interface Deal {
    id: string;
    title: string;
    companyName: string;
    value: number;
    currency: string;
    stageId: DealStage;
    probability: number;
    expectedCloseDate?: string;
    created_at?: string;
    lastActivityDate?: string;
    tags?: string[];
    owner?: {
        name: string;
        avatar?: string;
    };
}

export type ActivityType = "call" | "email" | "meeting" | "note" | "task" | "system";

export interface Activity {
    id: string;
    subject: string;
    type: ActivityType;
    created_at: string;
    notes?: string;
    user?: {
        name: string;
        avatar?: string;
    }
}

export interface KanbanColumn {
    id: DealStage;
    title: string;
    color: string;
    deals: Deal[];
    totalValue: number;
}

export interface PipelineState {
    columns: Record<DealStage, KanbanColumn>;
    columnOrder: DealStage[];
}
